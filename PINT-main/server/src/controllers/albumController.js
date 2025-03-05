const { id } = require('date-fns/locale');
const Album = require('../models/albumModel');
const FotoAlbum = require('../models/fotoAlbumModel');
const Notificacao = require('../models/notificacaoModel');
const Utilizador = require('../models/utilizadorModel');

exports.getAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Album.findByPk(id);
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

exports.criarAlbum = async (req, res) => {
    try {
        // Extrair dados do corpo da solicitação
        const { nome, descricao, idArea } = req.body;

        // Verificar se `req.file` está disponível
        const foto = req.file ? req.file.filename : null;

        const idCriador = req.user ? req.user.id : null;
        const bodyIdPosto = req.body ? req.body.idPosto : null;
        const tokenIdPosto = req.user ? req.user.idPosto : null;
        const idPosto = bodyIdPosto || tokenIdPosto || 1;

        // Criar o álbum no banco de dados
        const data = await Album.create({ nome, descricao, foto, idArea, idCriador, idPosto });

        // Retornar resposta de sucesso
        res.json({
            success: true,
            data: data,
        });
    } catch (err) {
        // Retornar resposta de erro
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}; 

exports.listarAlbums = async (req, res) => {
    try {
        const { idPosto: queryIdPosto, areaId } = req.query;

        const tokenIdPosto = req.user ? req.user.idPosto : null;
        const bodyIdPosto = req.body ? req.body.idPosto : null;

        const whereClause = {};
        if (queryIdPosto) {
            whereClause.idPosto = queryIdPosto;
        } else if (bodyIdPosto) {
            whereClause.idPosto = bodyIdPosto;
        } else if (tokenIdPosto) {
            whereClause.idPosto = tokenIdPosto;
        }
        if (areaId) {
            whereClause.idArea = areaId;
        }
        whereClause.estado = true; 

        const data = await Album.findAll({
            where: whereClause,
        });

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

exports.getAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Album.findByPk(id);
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

exports.editarAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, idArea, estado } = req.body;
        const foto = req.file ? req.file.filename : null;
        const data = await Album.update({ nome, descricao, foto, idArea, estado }, { where: { id } });
        res.json({
            success: true,
            data: data,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.apagarAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        // Apagar todas as fotos do álbum
        await FotoAlbum.destroy({ where: { idAlbum: id } });
        // Apagar o álbum
        const data = await Album.destroy({ where: { id } });
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


exports.adicionarFotoAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { descricao } = req.body;
        const foto = req.file ? req.file.filename : null;
        const idCriador = req.user.id;
        const data = await FotoAlbum.create({ idAlbum: id, idCriador, foto, descricao });
        res.json({
            success: true,
            data: data,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.getFotosAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await FotoAlbum.findAll({ 
            where: { idAlbum: id, estado: true }, 
            include: [{ model: Utilizador, as: 'criador', attributes: ['nome'] }] 
        });
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

exports.editarFotoAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { foto, descricao } = req.body;
        const data = await FotoAlbum.update({ foto, descricao }, { where: { id } });
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

exports.apagarFotoAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await FotoAlbum.destroy({ where: { id } });
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

exports.albumsFalse = async (req, res) => {
    try {
        const data = await Album.findAll({ where: { estado: false } });
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

exports.validarAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Album.update({ estado: true }, { where: { id } });
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

exports.fotosFalse = async (req, res) => {
    try {
        const data = await FotoAlbum.findAll({
            where: { estado: false },
            include: [{
                model: Album, // Ensure 'Album' is imported and available
                attributes: ['nome'], // Assuming the album name field is 'name'
            }]
        });
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
};

exports.validarFoto = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await FotoAlbum.update({ estado: true }, { where: { id } });
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

