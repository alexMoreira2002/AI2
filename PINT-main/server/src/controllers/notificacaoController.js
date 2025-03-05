const Notificacao = require('../models/notificacaoModel');
const Utilizador = require('../models/utilizadorModel');

exports.criarNotificacao = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const idUtilizador = req.user.id;
    const notificacao = await Notificacao.create({
      idUtilizador,
      titulo,
      descricao,
      data: new Date(),
      estado: false
    });
    res.status(201).json({
      status: 'success',
      data: {
        notificacao
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getNotificacoes = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findAll({
      where: {
        idUtilizador: req.user.id
      },
      include: [{ model: Utilizador, as: 'utilizador' }]
    });
    res.status(200).json({
      status: 'success',
      data: {
        notificacoes
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.apagarNotificacoes = async (req, res) => {
  try {
    const ids = req.body.ids;
    await Notificacao.destroy({ where: { id: ids } });
    res.status(200).send({ message: 'Notificações apagadas com sucesso.' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao apagar notificações.' });
  }
};

exports.marcarComoLidas = async (req, res) => {
  try {
    const ids = req.body.ids;
    await Notificacao.update({ estado: true }, { where: { id: ids } });
    res.status(200).send({ message: 'Notificações marcadas como lidas com sucesso.' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao marcar notificações como lidas.' });
  }
}

  exports.contadorNotificacoes = async (req, res) => {
      try {
          const contador = await Notificacao.count({
          where: {
              idUtilizador: req.user.id,
              estado: false  }
          });
          res.status(200).json({
          status: 'success',
          data: {
              contador
          }
          });
      } catch (err) {
          res.status(400).json({
          status: 'fail',
          message: err
          });
      }
      }


