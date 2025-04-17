
const gerarToken = require('../middlewares/gerarToken');
const Utilizador = require('../models/utilizadorModel');
const Posto = require('../models/postoModel');
const Inscricao = require('../models/inscricaoModel');
const Evento = require('../models/eventoModel');

require('dotenv').config();

exports.getUtilizador = (req, res) => {
    res.send(req.user);
  };

exports.getUtilizadorCompleto = async (req, res) => {
  const { id } = req.user;

  try {
    const utilizador = await Utilizador.findByPk(id, {
      include: [{
        model: Posto,
        attributes: ['nome'] 
      }]
    });
    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    res.send(utilizador);
  } catch (error) {
    console.error('Erro ao procurar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.getUtilizadores = async (req, res) => {
  const { idPosto } = req.query;

  try {
    let utilizadores;
    if (idPosto) {
      utilizadores = await Utilizador.findAll({ where: { idPosto } });
    } else {
      utilizadores = await Utilizador.findAll();
    }
    res.send(utilizadores);
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.utilizadorPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const utilizador = await Utilizador.findByPk(id);
    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    res.send(utilizador);
  } catch (error) {
    console.error('Erro ao procurar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
}

exports.criarUtilizador = async (req, res) => {
  const { nome, email, estado, isAdmin, idPosto } = req.body;

  try {
    const newUtilizador = await Utilizador.create({ nome, email, estado, isAdmin, idPosto });
    res.status(201).send({ message: 'Utilizador criado com sucesso', data: newUtilizador });
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.registar = async (req, res) => {
  const { nome, email } = req.body;

  // Validação básica
  if (!nome || !email) {
    return res.status(400).send({ error: 'Nome e email são obrigatórios' });
  }

  try {
    // Verifica se o email já está registrado
    const utilizadorExistente = await Utilizador.findOne({ where: { email } });
    if (utilizadorExistente) {
      return res.status(400).send({ error: 'Email já está em uso' });
    }

    // Cria um utilizador com estado padrão
    const novoUtilizador = await Utilizador.create({
      nome,
      email,
      estado: true, // Ativo por padrão
      isAdmin: false, // Não admin por padrão
      idPosto: null // Sem posto associado por padrão
      // Nota: A senha será definida num processo separado
    });

    res.status(201).send({ 
      message: 'Registro realizado com sucesso',
      utilizador: {
        id: novoUtilizador.id,
        nome: novoUtilizador.nome,
        email: novoUtilizador.email
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).send({ error: 'Erro ao registrar utilizador' });
  }
};

exports.apagarUtilizador = async (req, res) => {
  const { id } = req.params;

  try {
    const utilizador = await Utilizador.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    await utilizador.destroy();
    res.status(200).send({ message: 'Utilizador apagado com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};


exports.atualizarUtilizador = async (req, res) => {
  const { id } = req.params;
  const { nome, email, estado, isAdmin, idPosto, telemovel, nif, cargo, descricao, localidade } = req.body;
  let foto;

  if (req.file) {
    foto = req.file.filename;
  }

  try {
    const utilizador = await Utilizador.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    // Atualiza os campos conforme necessário
    if (nome !== undefined) utilizador.nome = nome;
    if (email !== undefined) utilizador.email = email;
    if (estado !== undefined) utilizador.estado = estado;
    if (isAdmin !== undefined) utilizador.isAdmin = isAdmin;
    if (idPosto !== undefined) utilizador.idPosto = idPosto;
    if (telemovel !== undefined) utilizador.telemovel = telemovel;
    if (nif !== undefined) utilizador.nif = nif;
    if (cargo !== undefined) utilizador.cargo = cargo;
    if (descricao !== undefined) utilizador.descricao = descricao;
    if (localidade !== undefined) utilizador.localidade = localidade;
    if (foto !== undefined) {
      utilizador.foto = foto;
      // Define `id_facebook` e `id_google` como null se uma nova foto for recebida
      utilizador.id_facebook = null;
      utilizador.id_google = null;
    }

    await utilizador.save();

    res.status(200).send({ message: 'Utilizador atualizado com sucesso', utilizador });
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};



exports.associarPosto = async (req, res) => {
  const { id, idPosto } = req.body;

  try {
    const user = await Utilizador.findByPk(id);
    const posto = await Posto.findByPk(idPosto);

    if (!user) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    if (!posto) {
      return res.status(404).send({ message: 'Posto não encontrado' });
    }

    user.idPosto = posto.id;
    await user.save();

    const token = gerarToken(user); 

    return res.status(200).send({ message: 'Utilizador associado ao posto com sucesso', token });
  } catch (error) {
    console.log(error); 
    return res.status(500).send({ message: 'Erro ao associar utilizador ao posto', error });
  }
};

exports.uploadFotoUtilizador = async (req, res) => {
  const { id } = req.params;
  const foto = req.file ? req.file.filename : null; 

  try {
    const utilizador = await Utilizador.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    utilizador.foto = foto; 
    await utilizador.save();

    res.status(200).send({ message: 'Foto do utilizador atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar foto do utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.deleteFotoUtilizador = async (req, res) => {
  const { id } = req.params;

  try {
    const utilizador = await Utilizador.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    utilizador.foto = null;
    await utilizador.save();

    res.status(200).send({ message: 'Foto do utilizador apagada com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar foto do utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
}

exports.getFotoUtilizador = async (req, res) => {
  const { id } = req.params;

  try {
    const utilizador = await Utilizador.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    if (!utilizador.foto) {
      return res.status(404).send({ message: 'Foto não encontrada' });
    }

    res.sendFile(utilizador.foto, { root: './uploads/utilizador' });
  } catch (error) {
    console.error('Erro ao encontrar foto do utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
}

exports.associarPreferencias = async (req, res) => {
  const { idArea, idSubarea } = req.body;
  const id = req.params.id;

  try {
    const utilizador = await Utilizador.findByPk(id);

    if (!utilizador) {
      return res.status(404).send({ message: 'Utilizador não encontrado' });
    }

    utilizador.idArea = idArea || null;
    utilizador.idSubarea = idSubarea || null;

    await utilizador.save();

    res.status(200).send({ message: 'Preferências do utilizador atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar preferências do utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor', message: error.message });
  }
};


exports.listarInscricoes = async (req, res) => {
  const { id } = req.params;

  try {
    const inscricoes = await Inscricao.findAll({
      where: { idUtilizador: id, estado: true },
      include: [
        { model: Utilizador, as: 'utilizador', attributes: ['nome'] },
        { 
          model: Evento, 
          as: 'evento', 
          attributes: ['titulo', 'data'],
          include: [
            { model: Posto, as: 'posto', attributes: ['nome'] } 
          ]
        },
      ]
    });

    const contador = inscricoes.length;
    res.status(200).send({ inscricoes, contador });
  } catch (error) {
    console.error('Erro ao listar inscrições:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};




