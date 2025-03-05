const Area = require('../models/areaModel');
const Subarea = require('../models/subareaModel');

exports.listarAreas = async (req, res) => {
    try {
        const data = await Area.findAll();
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

exports.listarSubareas = async (req, res) => {
    try {
        const { areaId } = req.params;
        const data = await Subarea.findAll({
            where: { idArea: areaId },
            include : [
                { model: Area,
                  attributes: ['nome'] 
                } ]
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

exports.criarArea = async (req, res) => {
    try {
      const { nome, icone } = req.body;
      const data = await Area.create({ nome, icone });
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

exports.criarSubarea = async (req, res) => {
    try {
      const { areaId } = req.params;
      const { nome } = req.body;
      if (!nome || !areaId) {
        return res.status(400).json({ error: 'Nome e ID da Área são obrigatórios.' });
      }

      const area = await Area.findByPk(areaId);
      if (!area) {
        return res.status(404).json({ error: 'Área não encontrada.' });
      }

      const novaSubarea = await Subarea.create({ nome, idArea: areaId });
      res.status(201).json(novaSubarea);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar Subárea.' });
    }
  };
