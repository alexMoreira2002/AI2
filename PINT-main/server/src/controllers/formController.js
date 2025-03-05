const { Op } = require('sequelize');
const Formulario = require('../models/formModel');
const Resposta = require('../models/respostaModel');
const Utilizador = require('../models/utilizadorModel');

exports.criarFormulario = async (req, res) => {
    try {
      const { campos, titulo, textoAuxiliar} = req.body;
      const { idEvento } = req.params;
  
      const formulario = await Formulario.create({
        campos,
        titulo,
        textoAuxiliar,
        idEvento,
      });
  
      res.status(201).json({ formulario });
    } catch (error) {
      console.error('Erro ao criar formulário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  exports.getFormularioEvento = async (req, res) => {
    try {
      const { idEvento } = req.params;
  
      const formulario = await Formulario.findAll({
        where: {
          idEvento,
        },
      });
  
      res.json({ formulario });
    } catch (error) {
      console.error('Erro ao buscar formulário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  exports.editarFormulario = async (req, res) => {
    try {
      const { campos, titulo, textoAuxiliar, estado} = req.body;
      const { id } = req.params;
  
      const formulario = await Formulario.findByPk(id);
  
      if (!formulario) {
        return res.status(404).json({ error: 'Formulário não encontrado' });
      }
  
      await formulario.update({
        campos,
        titulo,
        textoAuxiliar,
        estado,
      });
  
      res.json({ formulario });
    } catch (error) {
      console.error('Erro ao editar formulário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  exports.apagarFormulario = async (req, res) => {
    try {
      const { id } = req.params;
  
      const formulario = await Formulario.findByPk(id);
  
      if (!formulario) {
        return res.status(404).json({ error: 'Formulário não encontrado' });
      }
  
      const respostas = await Resposta.findAll({ where: { idFormulario: id } });
      for (const resposta of respostas) {
        await resposta.destroy();
      }
  
      await formulario.destroy();
  
      res.json({ message: 'Formulário e suas respostas apagados com sucesso' });
    } catch (error) {
      console.error('Erro ao apagar formulário e suas respostas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }


  exports.responderFormulario = async (req, res) => {
      const { id } = req.params;
      const { respostas } = req.body;
      const idUtilizador = req.user.id; 
  
      try {
          const formulario = await Formulario.findOne({
              where: { id: id },
          });
  
          if (!formulario) {
              return res.status(404).json({ error: 'Formulário não encontrado' });
          }
  
          await Resposta.create({
              idFormulario: id,
              respostas: respostas,
              idUtilizador: idUtilizador,
              data: new Date(), 
          });
  
          return res.status(201).json({ message: 'Respostas armazenadas com sucesso' });
      } catch (error) {
          console.error('Erro ao armazenar respostas:', error.message);
          return res.status(500).json({ error: 'Erro interno do servidor' });
      }
  };

  exports.getRespostasFormulario = async (req, res) => {
    const { id } = req.params;
  
    try {
      const respostas = await Resposta.findAll({
        where: {
          idFormulario: id,
        },
        include: [{
          model: Utilizador, 
          attributes: ['nome'], 
        },
        {
          model: Formulario,
          attributes: ['titulo'],
        }
      ],
      });
  
      res.json({ respostas });
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
