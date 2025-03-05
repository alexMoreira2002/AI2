const Evento = require('../models/eventoModel');
const Area = require('../models/areaModel');
const Subarea = require('../models/subareaModel');
const Utilizador = require('../models/utilizadorModel');
const Posto = require('../models/postoModel');
const FotoEvento = require('../models/fotoEventoModel');
const Inscricao = require('../models/inscricaoModel');
const Notificacao = require('../models/notificacaoModel');
const AvaliacaoEvento = require('../models/avaliacaoEventoModel');
const { Op } = require('sequelize');

exports.listarEventos = async (req, res) => {
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
        const data = await Evento.findAll({
            where: whereClause,
            include: [
                { model: Area, as: 'area', attributes: ['nome'] },
                { model: Subarea, as: 'subarea', attributes: ['nome'] },
                { model: Utilizador, as: 'criador', attributes: ['nome'] },
                { model: Utilizador, as: 'admin', attributes: ['nome'] },
                { model: Posto, as: 'posto', attributes: ['nome'] }
            ]
        });
        res.json({
            success: true,
            data: data,
        });
    } catch (err) {
        console.error('Erro ao listar eventos:', err.message); // Adicionado log de erro detalhado
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.eventosMobile = async (req, res) => {
    const areaId = req.body.areaId || req.params.areaId || req.query.areaId;
    const subareaId = req.body.subareaId || req.params.subareaId || req.query.subareaId;
    const idEvento = req.body.idEvento || req.params.idEvento || req.query.idEvento;
    const idPosto = req.body.idPosto || req.params.idPosto || req.query.idPosto;

    let whereClause = { estado: true };
    if (areaId) {
        whereClause.idArea = areaId;
    }
    if (subareaId) {
        whereClause.idSubarea = subareaId;
    }
    if (idEvento) {
        whereClause.idEvento = idEvento;
    }
    if (idPosto) { 
        whereClause.idPosto = idPosto; 
    }
    try {
        const data = await Evento.findAll({
            where: whereClause,
            include: [
                { model: Area, as: 'area', attributes: ['nome'] },
                { model: Subarea, as: 'subarea', attributes: ['nome'] },
                { model: Posto, as: 'posto', attributes: ['nome'] },
                { model: Utilizador, as: 'criador', attributes: ['nome'] },
                { model: Utilizador, as: 'admin', attributes: ['nome'] }
            ]
        });
        res.json({
            success: true,
            data: data,
        });
    }
    catch (err) {
        console.error('Erro ao listar eventos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.eventosCriador = async (req, res) => {
    const idCriador = req.user.id;
    try {
        const data = await Evento.findAll({
            where: { idCriador: idCriador },
            include: [
                { model: Area, as: 'area', attributes: ['nome'] },
                { model: Subarea, as: 'subarea', attributes: ['nome'] },
                { model: Utilizador, as: 'criador', attributes: ['nome'] },
                { model: Utilizador, as: 'admin', attributes: ['nome'] }
            ]
        });
        res.json({
            success: true,
            data: data,
        });
    } catch (err) {
        console.error('Erro ao listar eventos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};


exports.getEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Evento.findOne({
            where: { id: id },
            include: [
                { model: Area, as: 'area', attributes: ['nome'] },
                { model: Subarea, as: 'subarea', attributes: ['nome'] },
                { model: Utilizador, as: 'criador', attributes: ['nome'] },
                { model: Utilizador, as: 'admin', attributes: ['nome'] }
            ]
        });

        if (data) {
            res.status(200).json({
                success: true,
                data: data,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'O evento com o ID ' + id + ' não foi encontrado!',
            });
        }
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.CriarEvento = async (req, res) => {
    const {
        titulo,
        descricao,
        data,
        hora,
        morada,
        telemovel,
        email,
        idArea,
        idSubarea
    } = req.body;

    const idPosto = req.user.idPosto;
    const idCriador = req.user.id;
    const foto = req.file ? req.file.filename : null;

    try {
        const newEvento = await Evento.create({
            titulo,
            descricao,
            data,
            hora,
            morada,
            telemovel,
            email,
            foto,
            estado: false, 
            idArea,
            idSubarea,
            idCriador,
            idPosto
        });

        const notificacaoCriador = await Notificacao.create({
            idUtilizador: idCriador,
            titulo: 'Evento Enviado para Validação',
            descricao: `O seu evento, ${titulo}, foi criado e enviado para validação.`,
            estado: false,
            data: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Evento criado com sucesso, notificação enviada ao criador!',
            data: newEvento,
            notificacaoCriador: notificacaoCriador,
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao criar o evento e enviar notificações!" });
    }
};

exports.CriarEventoMobile = async (req, res) => {
    const {
        titulo,
        descricao,
        data,
        hora,
        morada,
        telemovel,
        email,
        idPosto,
        idArea,
        idSubarea
    } = req.body;

    const idCriador = req.user.id;
    const foto = req.file ? req.file.filename : null;

    try {
        const newEvento = await Evento.create({
            titulo,
            descricao,
            data,
            hora,
            morada,
            telemovel,
            email,
            foto,
            estado: false, 
            idArea,
            idSubarea,
            idCriador,
            idPosto
        });

        // Notificação para o criador do evento
        const notificacao = await Notificacao.create({
            idUtilizador: idCriador,
            titulo: 'Evento Enviado para Validação',
            descricao: `O seu evento, ${titulo}, foi criado e enviado para validação.`,
            estado: false,
            data: new Date()
        });

        const whereClause = {
            idArea
        };
        
        if (idSubarea) {
            whereClause.idSubarea = idSubarea;
        }
        


        res.status(200).json({
            success: true,
            message: 'Evento criado com sucesso, notificação enviada ao criador e notificações enviadas aos utilizadores!',
            data: newEvento,
            notificacao: notificacao,
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao criar o evento e enviar notificações!" });
    }
};


exports.editarEvento = async (req, res) => {
    const { id } = req.params;
    const {
        titulo,
        descricao,
        data,
        hora,
        morada,
        telemovel,
        email,
        idArea,
        idSubarea,
        idCriador,
        estado,
        idAdmin,
        inscricaoAberta
    } = req.body;

    try {
        // Verifica se o evento existe
        const eventoAtual = await Evento.findOne({ where: { id: id } });
        if (!eventoAtual) {
            return res.status(404).json({ success: false, message: 'Evento não encontrado.' });
        }

        // Verifica a foto existente e a nova foto
        const fotoExistente = eventoAtual ? eventoAtual.foto : null;
        const foto = req.file ? req.file.filename : fotoExistente;

        // Prepara os dados para atualização
        let updateData = {};

        if (titulo !== undefined) updateData.titulo = titulo;
        if (descricao !== undefined) updateData.descricao = descricao;
        if (data !== undefined) updateData.data = data;
        if (hora !== undefined) updateData.hora = hora;
        if (morada !== undefined) updateData.morada = morada;
        if (telemovel !== undefined) updateData.telemovel = telemovel;
        if (email !== undefined) updateData.email = email;
        if (idArea !== undefined) updateData.idArea = idArea;
        if (idSubarea !== undefined) updateData.idSubarea = idSubarea;
        if (idCriador !== undefined) updateData.idCriador = idCriador;
        if (estado !== undefined) updateData.estado = estado;
        if (idAdmin !== undefined) updateData.idAdmin = idAdmin;
        if (foto !== undefined) updateData.foto = foto;
        if (inscricaoAberta !== undefined) updateData.inscricaoAberta = inscricaoAberta;

        // Atualiza o evento
        const [updated] = await Evento.update(updateData, {
            where: { id: id }
        });

        if (updated) {
            // Encontra todos os inscritos no evento
            const inscritos = await Inscricao.findAll({
                where: { idEvento: id },
                include: [
                    { model: Utilizador, as: 'utilizador' }
                ]
            });

            const notificacoes = [];
            for (const inscricao of inscritos) {
                const utilizador = inscricao.utilizador;

                try {
                    const notificacao = await Notificacao.create({
                        idUtilizador: utilizador.id,
                        titulo: 'Evento Atualizado',
                        descricao: `Foram efetuadas alterações num evento onde se inscreveu: ${eventoAtual.titulo}`,
                        estado: false,
                        data: new Date()
                    });

                    notificacoes.push(notificacao);
                } catch (notificacaoError) {
                    console.error(`Erro ao criar notificação para o utilizador ${utilizador.id}:`, notificacaoError);
                }
            }

            // Obtém o evento atualizado
            const updatedEvento = await Evento.findOne({ where: { id: id } });

            // Retorna a resposta com sucesso e as notificações
            res.status(200).json({
                success: true,
                message: 'Evento atualizado com sucesso!',
                data: updatedEvento,
                notificacoes: notificacoes
            });
        } else {
            res.status(404).json({ success: false, message: 'Não foi possível atualizar o evento.' });
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ success: false, message: "Erro ao atualizar o evento!" });
    }
};



exports.apagarEvento = async (req, res) => {
    const { id } = req.params;
    try {
        // Encontrar o evento para obter o título
        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({ success: false, message: 'Evento não encontrado.' });
        }

        // Apagar todas as avaliações associadas ao evento
        await AvaliacaoEvento.destroy({
            where: { idEvento: id }
        });

        // Apagar todas as inscrições associadas ao evento
        const inscricoes = await Inscricao.findAll({
            where: { idEvento: id },
            include: [{ model: Utilizador, as: 'utilizador' }]
        });

        await Inscricao.destroy({
            where: { idEvento: id }
        });

        // Apagar todas as fotos associadas ao evento
        await FotoEvento.destroy({
            where: { idEvento: id }
        });

        // Apagar o evento
        await Evento.destroy({
            where: { id: id }
        });

        // Enviar notificações para todos os utilizadores inscritos
        const notificacoes = [];
        for (const inscricao of inscricoes) {
            const utilizador = inscricao.utilizador;

            try {
                const notificacao = await Notificacao.create({
                    idUtilizador: utilizador.id,
                    titulo: 'Evento Eliminado',
                    descricao: `Um evento onde se inscreveu foi eliminado: ${evento.titulo}`,
                    estado: false,
                    data: new Date()
                });

                notificacoes.push(notificacao);
            } catch (notificacaoError) {
                console.error(`Erro ao criar notificação para o utilizador ${utilizador.id}:`, notificacaoError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Evento apagado com sucesso!',
            notificacoes: notificacoes
        });
    } catch (error) {
        console.error('Erro ao apagar evento:', error);
        res.status(500).json({ success: false, message: "Erro ao apagar o evento!" });
    }
};


exports.getFotoEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const fotos = await FotoEvento.findAll({
            where: {
                idEvento: id,
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
                message: 'Nenhuma foto encontrada para o evento com o ID ' + id,
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


exports.deleteFotoEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const [evento] = await FotoEvento.update({
            estado: false,
        }, {
            where: { id: id }
        });

        if (evento) {
            res.status(200).json({ success: true, message: 'Foto removida com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Foto não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao remover foto:', error); // Adicione essa linha para registrar o erro no console
        res.status(500).json({ success: false, message: "Erro ao remover a foto!" });
    }
};

exports.uploadFotoEvento = async (req, res) => {
    const { id } = req.params;
    const { idUtilizador } = req.body;
    const foto = req.file ? req.file.filename : null;

    try {
        const newFoto = await FotoEvento.create({
            foto,
            idEvento: id,
            idCriador: idUtilizador,
            estado: false,
        });

        res.status(200).json({
            success: true,
            message: 'Foto adicionada com sucesso!',
            data: newFoto
        });
    } catch (error) {
        console.error('Erro ao criar nova foto:', error); // Adicione essa linha para registrar o erro no console
        res.status(500).json({ success: false, message: "Erro ao adicionar a foto!" });
    }
};

exports.EventosPorValidar = async (req, res) => {
    let idPosto;
    if (req.user) {
        idPosto = req.user.idPosto;
    }

    let whereClause = { estado: false };

    if (idPosto) {
        whereClause.idPosto = idPosto;
    }

    try {
        const data = await Evento.findAll({
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
        console.error('Erro ao listar eventos:', err.message);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.validarEvento = async (req, res) => {
    const { id } = req.params;
    const idAdmin = req.user.id;

    try {
        const evento = await Evento.findOne({ where: { id: id } });
        if (!evento) {
            return res.status(404).json({
                success: false,
                error: 'Evento não encontrado.',
            });
        }

        evento.estado = true;
        evento.idAdmin = idAdmin;
        await evento.save();

        const notificacaoCriador = await Notificacao.create({
            idUtilizador: evento.idCriador,
            titulo: 'Evento validado',
            descricao: `O seu evento ${evento.titulo} foi validado com sucesso!`,
            estado: false, 
            data: new Date(),
        });

        const utilizadores = await Utilizador.findAll({
            where: {
                idArea: evento.idArea,
                idSubarea: evento.idSubarea ? { [Op.or]: [evento.idSubarea, null] } : null
            }
        });
        
        console.log('Utilizadores:', utilizadores);

        const notificacoesUtilizadores = await Promise.all(utilizadores.map(utilizador => {
            return Notificacao.create({
                idUtilizador: utilizador.id,
                titulo: 'Evento Validado',
                descricao: `Um evento de seu interesse, ${evento.titulo}, foi criado!`,
                estado: false, 
                data: new Date()
            });
        }));


        res.json({
            success: true,
            data: evento,
            message: 'Evento validado com sucesso!',
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

exports.getInscricaoEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const inscricoes = await Inscricao.findAll({
            where: {
                idEvento: id,
                estado: true,
            },
            include: [
                { model: Utilizador, as: 'utilizador', attributes: ['nome'] },
                { model: Utilizador, as: 'admin', attributes: ['nome'] },
                { 
                  model: Evento, 
                  as: 'evento', 
                  attributes: ['titulo', 'data'],
                  include: [
                    { model: Posto, as: 'posto', attributes: ['nome'] } // Inclui o modelo Posto aqui
                  ]
                }
            ]
        });

        if (inscricoes.length > 0) {
            res.status(200).json({
                success: true,
                data: inscricoes,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Nenhuma inscrição encontrada para o evento com o ID ' + id,
            });
        }
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.inscreverEvento = async (req, res) => {
    const { id } = req.params;
    const idUtilizador = req.user.id; 

    try {
        const inscricaoExistente = await Inscricao.findOne({
            where: {
                idEvento: id,
                idUtilizador: idUtilizador
            }
        });

        console.log('Inscrição existente:', inscricaoExistente);

        if (inscricaoExistente) {
            return res.status(400).json({
                success: false,
                message: 'Utilizador já inscrito no evento.'
            });
        }

        await Inscricao.create({
            idEvento: id,
            idUtilizador: idUtilizador,
            estado: true
        });

        const evento = await Evento.findOne({ where: { id: id } });

        const notificacao = await Notificacao.create({
            idUtilizador: evento.idCriador,
            titulo: 'Nova Inscrição',
            descricao: `Tem uma nova inscrição no evento ${evento.titulo}!`,
            estado: false,
            data: new Date()
        });
        res.status(200).json({
            success: true,
            message: 'Inscrição realizada com sucesso!',
            notificacao: notificacao
        });
    } catch (error) {
        console.error('Erro ao inscrever:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar a inscrição!'
        });
    }
};

exports.desinscreverEvento = async (req, res) => {
    const { id } = req.params; // ID do evento
    const idUtilizador = req.user.id; // ID do utilizador a partir do token de autenticação

    try {
        // Verifica se o utilizador está inscrito no evento
        const inscricaoExistente = await Inscricao.findOne({
            where: {
                idEvento: id,
                idUtilizador: idUtilizador
            }
        });

        if (!inscricaoExistente) {
            return res.status(404).json({
                success: false,
                message: 'Nenhuma inscrição encontrada para o evento com o ID ' + id,
            });
        }

        await Inscricao.destroy({
            where: {
                idEvento: id,
                idUtilizador: idUtilizador
            }
        });

        res.status(200).json({
            success: true,
            message: 'Inscrição removida com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao desinscrever:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar a desinscrição!'
        });
    }
};

exports.verificarInscricao = async (req, res) => {
    const { id } = req.params; 
    const idUtilizador = req.user.id; 
    try {
        const inscricao = await Inscricao.findOne({
            where: {
                idEvento: id,
                idUtilizador: idUtilizador
            }
        });

        if (inscricao) {
            res.status(200).json({
                success: true,
                data: inscricao,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Nenhuma inscrição encontrada para o evento com o ID ' + id,
            });
        }
    } catch (error) {
        console.error('Erro ao verificar inscrição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar a inscrição!'
        });
    }
}

