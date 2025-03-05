const Posto = require('../models/postoModel');

exports.listarPostos = async (req, res) => {
    try {
        const data = await Posto.findAll();
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

exports.get = async (req, res) => {
    const { postoId } = req.params;
    try {
        const data = await Posto.findOne({
            where: { id: postoId }
        });

        if (data) {
            res.status(200).json({
                success: true,
                data: data,
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Posto não encontrado',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.criarPosto = async (req, res) => {
    try {
      const { nome } = req.body;
      const novoPosto = await Posto.create({ nome });
      res.status(201).json(novoPosto);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar Posto.' });
    }
  };

