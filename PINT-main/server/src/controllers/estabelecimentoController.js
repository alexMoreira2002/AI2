const Estabelecimento = require('../models/estabelecimentoModel');
const Area = require('../models/areaModel');
const Subarea = require('../models/subareaModel');
const Posto = require('../models/postoModel');
const FotoEstabelecimento = require('../models/fotoEstabelecimentoModel');
const Utilizador = require('../models/utilizadorModel');
const AvaliacaoEstabelecimento = require('../models/avaliacaoEstabelecimentoModel');
const Notificacao = require('../models/notificacaoModel');
const Preco = require('../models/precoModel');
const { Op } = require('sequelize');

exports.listarEstabelecimentos = async (req, res) => {
    const { areaId, subareaId } = req.query;
    let idPosto;
    if (req.user) {
        idPosto = req.user.idPosto;
    }

    let whereClause = { estado: true }; 
    if (areaId) {
        whereClause.idArea = areaId;
    }
    if (subareaId) {
        whereClause.idSubarea = subareaId;
    }
    if (idPosto) {
        whereClause.idPosto = idPosto;
    }

    try {
        // Encontrar todos os estabelecimentos com suas associações
        const estabelecimentos = await Estabelecimento.findAll({
            where: whereClause,
            include: [
                { model: Area, attributes: ['nome'] },
                { model: Subarea, attributes: ['nome'] },
                { model: Posto, attributes: ['nome'] },
            ],
            raw: true, // Para obter todos os campos como objetos puros
            nest: true // Para garantir que os dados aninhados sejam corretamente formatados
        });

        // Mapear para obter os IDs dos estabelecimentos e buscar médias de preço e avaliação
        const estabelecimentosIds = estabelecimentos.map(est => est.id);

        const [precos, avaliacaoEstabelecimentos] = await Promise.all([
            Preco.findAll({
                where: {
                    idEstabelecimento: { [Sequelize.Op.in]: estabelecimentosIds },
                    estado: true
                },
                attributes: [
                    'idEstabelecimento',
                    [Sequelize.fn('AVG', Sequelize.col('preco')), 'preco']
                ],
                group: ['idEstabelecimento'],
                raw: true
            }),
            AvaliacaoEstabelecimento.findAll({
                where: {
                    idEstabelecimento: { [Sequelize.Op.in]: estabelecimentosIds },
                    estado: true
                },
                attributes: [
                    'idEstabelecimento',
                    [Sequelize.fn('AVG', Sequelize.col('classificacao')), 'classificacao']
                ],
                group: ['idEstabelecimento'],
                raw: true
            })
        ]);

        // Criar um mapa de médias para preços e avaliações
        const precoMap = precos.reduce((acc, item) => {
            acc[item.idEstabelecimento] = parseFloat(item.preco); // Converta para número
            return acc;
        }, {});

        const classificacaoMap = avaliacaoEstabelecimentos.reduce((acc, item) => {
            acc[item.idEstabelecimento] = parseFloat(item.classificacao); // Converta para número
            return acc;
        }, {});

        // Formatar os resultados para incluir médias de preços e avaliações
        const formattedData = estabelecimentos.map(est => ({
            ...est, // Inclui todos os campos do estabelecimento
            preco: precoMap[est.id] ? parseFloat(precoMap[est.id]).toFixed(2) : '0.00', // Garantir que seja formatado como decimal
            classificacao: classificacaoMap[est.id] ? parseFloat(classificacaoMap[est.id]).toFixed(2) : '0.00', // Garantir que seja formatado como decimal
        }));

        res.json({
            success: true,
            data: formattedData,
        });
    }
    catch (err) {
        console.error('Erro ao listar estabelecimentos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.validarEstabelecimento = async (req, res) => {
    const { id } = req.params;
    const idAdmin = req.user.id;

    try {
        const estabelecimento = await Estabelecimento.findOne({ where: { id: id } });
        if (!estabelecimento) {
            return res.status(404).json({
                success: false,
                error: 'Estabelecimento não encontrado.',
            });
        }

        estabelecimento.estado = true;
        estabelecimento.idAdmin = idAdmin;
        await estabelecimento.save();

        const notificacaoCriador = await Notificacao.create({
            idUtilizador: estabelecimento.idCriador,
            titulo: 'Estabelecimento validado',
            descricao: `O seu estabelecimento, ${estabelecimento.nome}, foi validado com sucesso!`,
            estado: false, 
            data: new Date(),
        });

        // Supondo que estabelecimentos também têm idArea e idSubarea
        const utilizadores = await Utilizador.findAll({
            where: {
                idArea: estabelecimento.idArea,
                idSubarea: estabelecimento.idSubarea ? { [Op.or]: [estabelecimento.idSubarea, null] } : null
            }
        });

        const notificacoesUtilizadores = await Promise.all(utilizadores.map(utilizador => {
            return Notificacao.create({
                idUtilizador: utilizador.id,
                titulo: 'Estabelecimento Validado',
                descricao: `Um estabelecimento de seu interesse, ${estabelecimento.nome}, foi validado!`,
                estado: false, 
                data: new Date()
            });
        }));

        res.json({
            success: true,
            data: estabelecimento,
            message: 'Estabelecimento validado com sucesso!',
            notificacaoCriador: notificacaoCriador,
            notificacoesUtilizadores: notificacoesUtilizadores
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.estabelecimentosMobile = async (req, res) => {
    const areaId = req.body.areaId || req.params.areaId || req.query.areaId;
    const subareaId = req.body.subareaId || req.params.subareaId || req.query.subareaId;
    const idPosto = req.body.idPosto || req.params.idPosto || req.query.idPosto;

    let whereClause = { estado: true };
    if (areaId) {
        whereClause.idArea = areaId;
    }
    if (subareaId) {
        whereClause.idSubarea = subareaId;
    }
    if (idPosto) {
        whereClause.idPosto = idPosto;
    }
    
    try {
        // Encontrar todos os estabelecimentos com suas associações
        const estabelecimentos = await Estabelecimento.findAll({
            where: whereClause,
            include: [
                { model: Area, attributes: ['nome'] },
                { model: Subarea, attributes: ['nome'] },
                { model: Posto, attributes: ['nome'] },
            ],
            raw: true, // Para obter todos os campos como objetos puros
            nest: true // Para garantir que os dados aninhados sejam corretamente formatados
        });

        // Mapear para obter os IDs dos estabelecimentos e buscar médias de preço e avaliação
        const estabelecimentosIds = estabelecimentos.map(est => est.id);

        const [precos, avaliacaoEstabelecimentos] = await Promise.all([
            Preco.findAll({
                where: {
                    idEstabelecimento: { [Sequelize.Op.in]: estabelecimentosIds },
                    estado: true
                },
                attributes: [
                    'idEstabelecimento',
                    [Sequelize.fn('AVG', Sequelize.col('preco')), 'preco']
                ],
                group: ['idEstabelecimento'],
                raw: true
            }),
            AvaliacaoEstabelecimento.findAll({
                where: {
                    idEstabelecimento: { [Sequelize.Op.in]: estabelecimentosIds },
                    estado: true
                },
                attributes: [
                    'idEstabelecimento',
                    [Sequelize.fn('AVG', Sequelize.col('classificacao')), 'classificacao']
                ],
                group: ['idEstabelecimento'],
                raw: true
            })
        ]);

        // Criar um mapa de médias para preços e avaliações
        const precoMap = precos.reduce((acc, item) => {
            acc[item.idEstabelecimento] = parseFloat(item.preco); // Converta para número
            return acc;
        }, {});

        const classificacaoMap = avaliacaoEstabelecimentos.reduce((acc, item) => {
            acc[item.idEstabelecimento] = parseFloat(item.classificacao); // Converta para número
            return acc;
        }, {});

        // Formatar os resultados para incluir médias de preços e avaliações
        const formattedData = estabelecimentos.map(est => ({
            ...est, // Inclui todos os campos do estabelecimento
            preco_medio: precoMap[est.id] ? parseFloat(precoMap[est.id]).toFixed(2) : '0.00', // Garantir que seja formatado como decimal
            classificacao_media: classificacaoMap[est.id] ? parseFloat(classificacaoMap[est.id]).toFixed(2) : '0.00', // Garantir que seja formatado como decimal
        }));

        res.json({
            success: true,
            data: formattedData,
        });
    }
    catch (err) {
        console.error('Erro ao listar estabelecimentos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};


exports.criarEstabelecimento = async (req, res) => {
    const {
        nome,
        idArea,
        idSubarea,
        morada,
        descricao,
        telemovel,
        email,
    } = req.body;

    const foto = req.file ? req.file.filename : null;
    const idCriador = req.user.id;
    const idPosto = req.user.idPosto;

    try {
        const newEstabelecimento = await Estabelecimento.create({
            nome,
            idArea,
            idSubarea,
            idPosto,
            morada,
            descricao,
            telemovel: String(telemovel), // Garantindo que seja uma string
            email: String(email), // Garantindo que seja uma string
            idCriador,
            foto
        });

        const notificacao = await Notificacao.create({
            idUtilizador: idCriador,
            titulo: 'Estabelecimento criado',
            descricao: `O seu estabelecimento ${nome} foi criado com sucesso e enviado para validação!`,
            estado: false,
            data: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Estabelecimento criado com sucesso!',
            data: newEstabelecimento,
            notificacao: notificacao
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao criar o estabelecimento!" });
    }
};


exports.criarEstabelecimentoMobile = async (req, res) => {
    const {
        nome,
        idArea,
        idSubarea,
        morada,
        idPosto,
        descricao,
        telemovel,
        email,
        idAdmin
    } = req.body;

    const foto = req.file ? req.file.filename : null;
    const idCriador = req.user.id;

    try {
        const newEstabelecimento = await Estabelecimento.create({
            nome,
            idArea,
            idSubarea,
            idPosto,
            morada,
            descricao,
            telemovel,
            email,
            idAdmin,
            idCriador,
            foto
        });

        const notificacao = await Notificacao.create({
            idUtilizador: idCriador,
            titulo: 'Estabelecimento criado',
            descricao: `O seu estabelecimento ${nome} foi criado com sucesso e enviado para validação!`,
            estado: false,
            data: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Estabelecimento criado com sucesso!',
            data: newEstabelecimento,
            notificacao: notificacao
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao criar o estabelecimento!" });
    }
};

const { Sequelize } = require('sequelize');

exports.getEstabelecimento = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Estabelecimento.findOne({
            where: { id: id },
            include: [
                { model: Area, attributes: ['nome'] },
                { model: Subarea, attributes: ['nome'] },
                { model: Posto, attributes: ['nome'] },
            ]
        });

        const preco = await Preco.findAll({
            where: { idEstabelecimento: id, estado: true },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('preco')), 'preco']
            ],
            raw: true,
        });

        const classificacao = await AvaliacaoEstabelecimento.findOne({
            where: { idEstabelecimento: id, estado: true },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('classificacao')), 'classificacao']
            ],
            raw: true,
        });

        console.log('preco:', preco);
        console.log('classificacao:', classificacao);

        if (data) {
            res.status(200).json({
                success: true,
                data: data,
                preco_medio: preco.length > 0 ? parseFloat(preco[0].preco).toFixed(2) : 0,
                classificacao_media: classificacao ? parseFloat(classificacao.classificacao).toFixed(2) : 0,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'O estabelecimento com o ID ' + id + ' não foi encontrado!',
            });
        }
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.getFotoEstabelecimento = async (req, res) => {
    const { id } = req.params;
    try {
        const fotos = await FotoEstabelecimento.findAll({
            where: {
                idEstabelecimento: id,
                estado: true,
            },
            include: [
                {
                    model: Utilizador,
                    as: 'criador',
                    attributes: ['nome'],
                },
                {
                    model: Utilizador,
                    as: 'admin',
                    attributes: ['nome'],
                },
            ],
        });

        if (fotos.length > 0) {
            res.status(200).json({
                success: true,
                data: fotos,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Nenhuma foto encontrada para o estabelecimento com o ID ' + id,
            });
        }
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.editarEstabelecimento = async (req, res) => {
    const { id } = req.params;
    const {
        nome,
        idArea,
        idSubarea,
        idPosto,
        morada,
        descricao,
        telemovel,
        email,
        estado,
        idAdmin,
        idCriador,
    } = req.body;

    const estabelecimentoAtual = await Estabelecimento.findOne({ where: { id: id } });
    const fotoExistente = estabelecimentoAtual ? estabelecimentoAtual.foto : null;

    const foto = req.file ? req.file.filename : fotoExistente;

    let updateData = {
        nome,
        idArea,
        idSubarea,
        idPosto,
        morada,
        descricao,
        telemovel,
        email,
        estado,
        idAdmin,
        idCriador,
        foto 
    };

    try {
        const [updated] = await Estabelecimento.update(updateData, {
            where: { id: id }
        });

        if (updated) {
            const updatedEstabelecimento = await Estabelecimento.findOne({ where: { id: id } });
            res.status(200).json({ success: true, message: 'Estabelecimento atualizado com sucesso!', data: updatedEstabelecimento });
        } else {
            res.status(404).json({ success: false, message: 'Não foi possível atualizar o estabelecimento.' });
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao atualizar o estabelecimento!" });
    }
};

exports.uploadFotoEstabelecimento = async (req, res) => {
    const { id } = req.params;
    const { idUtilizador } = req.body;
    const foto = req.file ? req.file.filename : null;

    try {
        const newFoto = await FotoEstabelecimento.create({
            foto,
            idEstabelecimento: id,
            idCriador: idUtilizador,
            estado: false,
        });

        res.status(200).json({
            success: true,
            message: 'Foto adicionada com sucesso!',
            data: newFoto
        });
    } catch (error) {
        console.error('Erro ao criar nova foto:', error);
        res.status(500).json({ success: false, message: "Erro ao adicionar a foto!" });
    }
};

exports.deleteFotoEstabelecimento = async (req, res) => {
    const { id } = req.params;
    try {
        const [apagado] = await FotoEstabelecimento.update({
            estado: false,
        }, {
            where: { id: id }
        });

        if (apagado) {
            res.status(200).json({ success: true, message: 'Foto removida com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Foto não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao remover foto:', error);
        res.status(500).json({ success: false, message: "Erro ao remover a foto!" });
    }
};

exports.apagarEstabelecimento = async (req, res) => {
    const { id } = req.params;
    
    try {
        await AvaliacaoEstabelecimento.destroy({
            where: { idEstabelecimento: id }
        });

        await FotoEstabelecimento.destroy({
            where: { idEstabelecimento: id }
        });

        const apagado = await Estabelecimento.destroy({
            where: { id: id }
        });

        if (apagado) {
            res.status(200).json({ success: true, message: 'Estabelecimento apagado com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Estabelecimento não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao apagar estabelecimento:', error);
        res.status(500).json({ success: false, message: "Erro ao apagar o estabelecimento!" });
    }
};

exports.EstabelecimentosPorValidar = async (req, res) => {
    let idPosto;
    if (req.user) {
        idPosto = req.user.idPosto;
    }
    console.log('ID Posto:', idPosto);
    let whereClause = { estado: false };

    if (idPosto) {
        whereClause.idPosto = idPosto;
    }
    try {
        const data = await Estabelecimento.findAll({
            where: whereClause,
            include: [
                { model: Utilizador, as: 'criador', attributes: ['nome'] },
            ]
        });

        res.json({
            success: true,
            data: data,
            contador: data.length, 
        });
    } catch (err) {
        console.error('Erro ao listar estabelecimentos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.validarEstabelecimento = async (req, res) => {
    const { id } = req.params;
    const idAdmin = req.user.id;

    try {
        const estabelecimento = await Estabelecimento.findOne({ where: { id: id } });
        if (!estabelecimento) {
            return res.status(404).json({
                success: false,
                error: 'Estabelecimento não encontrado.',
            });
        }

        estabelecimento.estado = true;
        estabelecimento.idAdmin = idAdmin;
        await estabelecimento.save();

        const notificacaoCriador = await Notificacao.create({
            idUtilizador: estabelecimento.idCriador,
            titulo: 'Estabelecimento Validado',
            descricao: `O seu estabelecimento ${estabelecimento.nome} foi validado com sucesso!`,
            estado: false, 
            data: new Date(),
        });

        const utilizadores = await Utilizador.findAll({
            where: {
                idArea: estabelecimento.idArea,
                idSubarea: estabelecimento.idSubarea ? { [Op.or]: [estabelecimento.idSubarea, null] } : null
            }
        });

        const notificacoesUtilizadores = await Promise.all(utilizadores.map(utilizador => {
            return Notificacao.create({
                idUtilizador: utilizador.id,
                titulo: 'Estabelecimento Validado',
                descricao: `Um estabelecimento de seu interesse, ${estabelecimento.nome}, foi criado!`,
                estado: false, 
                data: new Date()
            });
        }));

        res.json({
            success: true,
            data: estabelecimento,
            message: 'Estabelecimento validado com sucesso!',
            notificacaoCriador: notificacaoCriador,
            notificacoesUtilizadores: notificacoesUtilizadores
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.adicionarPreco = async (req, res) => {
    try {
      const { idEstabelecimento } = req.params;
      const { preco } = req.body;
      if (!preco || !idEstabelecimento) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios não preenchidos',
        });
      }
      const data = await Preco.create({ idEstabelecimento, preco });
      res.json({
        success: true,
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Erro: ' + err.message,
      });
    }
  }
