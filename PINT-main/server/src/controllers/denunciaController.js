const Denuncia = require('../models/denunciaModel');
const Utilizador = require('../models/utilizadorModel');
const AvaliacaoEvento = require('../models/avaliacaoEventoModel');
const AvaliacaoEstabelecimento = require('../models/avaliacaoEstabelecimentoModel');

exports.criarDenuncia = async (req, res) => {
    const id = req.user.id;
    const { idAvaliacaoEvento, idAvaliacaoEstabelecimento } = req.body;

    
    let dadosDenuncia = {
        idCriador: id, 
    };

    if (idAvaliacaoEvento) {
        dadosDenuncia.idAvaliacaoEvento = idAvaliacaoEvento;
    } else if (idAvaliacaoEstabelecimento) {
        dadosDenuncia.idAvaliacaoEstabelecimento = idAvaliacaoEstabelecimento;
    }

    console.log('Dados da denúncia:', dadosDenuncia);

    try {
        const denuncia = await Denuncia.create(dadosDenuncia);

        console.log('Denúncia criada:', denuncia);
        console.log('Dados da denúncia:', dadosDenuncia);


        res.status(201).json({
            success: true,
            data: denuncia
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao criar denúncia'
        });
    }
};

exports.listarDenuncias = async (req, res) => {
    try {
        const denuncias = await Denuncia.findAll({
            include: [
                { model: Utilizador, as: 'criador', attributes: ['nome'] },
                { model: AvaliacaoEvento, as: 'avaliacaoEvento', attributes: ['comentario', 'idEvento']},
                { model: AvaliacaoEstabelecimento, as: 'avaliacaoEstabelecimento', attributes: ['comentario', 'idEstabelecimento']}
            ],
        });

        const contador = denuncias.length;

        res.json({
            success: true,
            data: denuncias,
            contador: contador
        });
    } catch (error) {
        console.error('Erro ao listar denúncias:', error); 
        res.status(500).json({
            success: false,
            error: 'Erro ao listar denúncias'
        });
    }
};

exports.apagarDenuncia = async (req, res) => {
    const { id } = req.params;

    try {
        const denuncia = await Denuncia.findByPk(id);
        if (!denuncia) {
            return res.status(404).json({
                success: false,
                error: 'Denúncia não encontrada'
            });
        }

        await denuncia.destroy();

        res.json({
            success: true,
            data: denuncia
        });
    } catch (error) {
        console.error('Erro ao apagar denúncia:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao apagar denúncia'
        });
    }
}

exports.validarDenuncia = async (req, res) => {
    const { id } = req.params;

    try {
        const denuncia = await Denuncia.findByPk(id);

        if (!denuncia) {
            return res.status(404).json({
                success: false,
                error: 'Denúncia não encontrada'
            });
        }

        if (denuncia.idAvaliacaoEvento) {
            const avaliacaoEvento = await AvaliacaoEvento.findByPk(denuncia.idAvaliacaoEvento);

            if (!avaliacaoEvento) {
                return res.status(404).json({
                    success: false,
                    error: 'Avaliação de evento não encontrada'
                });
            }

            await avaliacaoEvento.destroy();
        } else if (denuncia.idAvaliacaoEstabelecimento) {
            const avaliacaoEstabelecimento = await AvaliacaoEstabelecimento.findByPk(denuncia.idAvaliacaoEstabelecimento);

            if (!avaliacaoEstabelecimento) {
                return res.status(404).json({
                    success: false,
                    error: 'Avaliação de estabelecimento não encontrada'
                });
            }

            await avaliacaoEstabelecimento.destroy();
        }

        // Após apagar a avaliação, apaga a denúncia
        await denuncia.destroy();

        res.status(200).json({
            success: true,
            message: 'Denúncia validada e avaliação apagada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao validar denúncia:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao validar denúncia'
        });
    }
};
