const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const Utilizador = require('../models/utilizadorModel');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
require('dotenv').config();
const gerarToken = require('../middlewares/gerarToken');
const { access } = require('fs');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Preencha todos os campos' });
    }

    const user = await Utilizador.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ error: 'Utilizador não encontrado' });
    }

    if (!user.isAdmin) {
      return res.status(401).send({ error: 'Acesso negado' });
    }

    if (!user.estado) {
      return res.status(401).send({ error: 'Conta não verificada. Verifique o seu email para ativar a sua conta.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.palavra_passe);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Palavra Passe incorreta' });
    }

    const hora = new Date();
    const horaAtual = new Date(hora.getTime() + 3600000); //fuso horário estava 1h atrás
    await user.update({ ultimoLogin: horaAtual });

    const token = gerarToken(user);

    if (user.isPrimeiroLogin) {
      const recoveryToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      await user.update({ recoveryToken, isPrimeiroLogin: false });
    }

    res.send({ message: 'Login realizado com sucesso', token, recoveryToken: user.recoveryToken });
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.loginMobile = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Preencha todos os campos' });
    }

    const user = await Utilizador.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ error: 'Utilizador não encontrado' });
    }

    if (isAdmin && !user.isAdmin) {
      return res.status(401).send({ error: 'Acesso negado' });
    }

    if (!user.estado) {
      return res.status(401).send({ error: 'Conta não verificada. Verifique o seu email para ativar a sua conta.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.palavra_passe);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Palavra Passe incorreta' });
    }

    const hora = new Date();
    const horaAtual = new Date(hora.getTime() + 3600000); 
    await user.update({ ultimoLogin: horaAtual });

    const token = gerarToken(user);

    if (user.isPrimeiroLogin) {
      const recoveryToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      await user.update({ recoveryToken, isPrimeiroLogin: false });
    }

    res.send({ message: 'Login realizado com sucesso', token, recoveryToken: user.recoveryToken });
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};


exports.criarConta = async (req, res) => {
  try {
    const { nome, email } = req.body;
    console.log(req.body);

    if (!nome || !email) {
      return res.status(400).send({ error: 'Preencha todos os campos' });
    }

    const user = await Utilizador.findOne({ where: { email } });
    if (user) {
      return res.status(400).send({ error: 'Email já está em uso' });
    }

    const password = crypto.randomBytes(10).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const hora = new Date();
    const horaAtual = new Date(hora.getTime() + 3600000);

    const verificationToken = crypto.randomBytes(32).toString('hex');
 
    const novoUser = await Utilizador.create({
      nome,
      email,
      palavra_passe: hashedPassword,
      verificationToken,
      estado: false,
      isPrimeiroLogin: true,
      ultimoLogin: horaAtual
    });

    const token = gerarToken(novoUser);

    const verificationUrl = `${process.env.REACT_APP_FRONTEND}/verificar-conta?token=${verificationToken}`;
    await enviarEmail({  
      email,
      subject: 'Verifique o seu email',
      message: `Clique no link a seguir para verificar a sua conta: ${verificationUrl}.\n\nA sua password temporária é: ${password}`
    });

    res.status(201).send({ message: 'Conta criada com sucesso. Verifique o seu email para ativar sua conta.', token });
  } catch (error) {
    console.error('Error during account creation:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.verificarEmail = async (req, res) => {
  try {
    const { token } = req.body || req.query; 

    if (!token) {
      return res.status(400).send({ error: 'Token de verificação não fornecido' });
    }

    const user = await Utilizador.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).send({ error: 'Token de verificação inválido' });
    }

    user.estado = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).send({ message: 'Email verificado com sucesso. Pode seguir para o login' });
  } catch (error) {
    console.error('Erro durante a verificação de email:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};
 

exports.recuperarPasse = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Utilizador.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({ error: 'Utilizador não encontrado' });
    }

    const recoveryToken = crypto.randomBytes(32).toString('hex');
    user.recoveryToken = recoveryToken; 
    await user.save();

    const resetUrl = `${process.env.REACT_APP_FRONTEND}/reset-passe?token=${recoveryToken}`;
    await enviarEmail({
      email,
      subject: 'Recuperação de Palavra Passe',
      message: `Clique no link a seguir para redefinir a sua palavra-passe: ${resetUrl}`
    });

    res.send({ message: 'Email enviado com sucesso. Verifique o seu email para recuperar a password ' });
  } catch (error) {
    console.error('Error during password recovery:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.resetarPasse = async (req, res) => {
  try {
    const { token, novaPass } = req.body;

    const user = await Utilizador.findOne({ where: { recoveryToken: token } });
    if (!user) {
      return res.status(400).send({ error: 'Token inválido' });
    }

    user.isPrimeiroLogin = false;
    await user.save();

    const hashedPassword = await bcrypt.hash(novaPass, 12);
    user.palavra_passe = hashedPassword;
    user.recoveryToken = null;
    await user.save();

    res.send({ message: 'A sua password foi redefinida com sucesso' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

const enviarEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const mailOptions = {
    from: 'The Softshares <thesoftshares@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado');
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao enviar email');
  }
};


exports.google = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token não fornecido' });
    }

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error("Erro na verificação com GOOGLE_CLIENT_ID, tentando com GOOGLE_CLIENT_IOS", error);
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_IOS,
      });
    }

    const payload = ticket.getPayload();
    const email = payload['email'];
    const nome = payload['name'];
    const foto = payload['picture'];
    const id_google = payload['sub'];

    let user = await Utilizador.findOne({ where: { email } });

    if (!user) {
      const respostaCriarConta = await criarContaGoogleHandler({ nome, email, foto, id_google });
      return res.json({ ...respostaCriarConta, user: { nome, email, foto, id_google } });
    } else {
      req.body.email = email;
      const loginResponse = await loginGoogleHandler(req);
      return res.json({ ...loginResponse, user: { nome, email, foto, id_google } });
    }
  } catch (error) {
    console.error('Erro ao autenticar com Google:', error);
    return res.status(500).json({ error: 'Erro ao autenticar com Google' });
  }
};

const loginGoogleHandler = async (req) => {
  try {
    const { email } = req.body;
    const user = await Utilizador.findOne({ where: { email } });
    const token = gerarToken(user);
    const hora = new Date();
    const horaAtual = new Date(hora.getTime() + 3600000); //fuso horário estava 1h atrás
    await user.update({ ultimoLogin: horaAtual });
    return { token, message: 'Login realizado com sucesso' };
  } catch (error) {
    throw new Error('Erro ao fazer login com Google');
  }
};

const criarContaGoogleHandler = async ({ nome, email, foto, id_google}) => {
  try {
    if (!nome || !email) {
      throw new Error('Nome e email são necessários');
    }

    const existingUser = await Utilizador.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const password = crypto.randomBytes(10).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const hora = new Date();
    const horaAtual = new Date(hora.getTime() + 3600000);

    const novoUser = await Utilizador.create({
      nome,
      email,
      palavra_passe: hashedPassword,
      foto,
      id_google,
      estado: true,
      isPrimeiroLogin: true,
      ultimoLogin: horaAtual
    });

    const token = gerarToken(novoUser);

    await enviarEmail({
      email,
      subject: 'Bem-vindo ao Softshares',
      message: `A sua conta foi criada com sucesso. Aqui está a sua palavra-passe temporária: ${password}. Irá atualizá-la após o login.`
    });

    return { token, message: 'Conta criada com sucesso.' };
  } catch (error) {
    console.error('Erro ao criar conta com Google:', error);
    throw new Error('Erro ao criar conta com Google');
  }
};
exports.facebook = async (req, res) => {
  try {
    const {id, nome, email, foto} = req.body; 
    console.log(req.body);

    if (!email) {
      return res.status(400).json({ error: 'Email não fornecido pelo Facebook' });
    }

    let user = await Utilizador.findOne({ where: { email } });

    if (!user) {
      const respostaCriarConta = await criarContaFacebookHandler({id, nome, email, foto});
      return res.json({ ...respostaCriarConta, user: { email, nome, foto, id_facebook: id } });
    } else {
      req.body.email = email; // Certifique-se de que o email é atribuído corretamente
      const loginResponse = await loginFacebookHandler(req);
      return res.json({ ...loginResponse, user: { email, nome, foto, id_facebook: id } });
    }
  } catch (error) {
    console.error('Erro ao autenticar com Facebook:', error);
    return res.status(500).json({ error: 'Erro ao autenticar com Facebook' });
  }
};

const loginFacebookHandler = async (req) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error('Email não fornecido');
    }

    const user = await Utilizador.findOne({ where: { email } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const token = gerarToken(user);

    const hora = new Date();
    const horaAtual = new Date(hora.getTime() + 3600000); //fuso horário estava 1h atrás
    await user.update({ ultimoLogin: horaAtual });

    return { token, message: 'Login realizado com sucesso' };
  } catch (error) {
    throw new Error('Erro ao fazer login com Facebook');
  }
};

const criarContaFacebookHandler = async ({ id, nome, email, foto }) => {
  try {
    if (!nome || !email) {
      throw new Error('Nome e email são necessários');
    }

    const existingUser = await Utilizador.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const password = crypto.randomBytes(10).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const hora = new Date();
    const horaAtual = new Date(hora.getTime() + 3600000);

    const novoUser = await Utilizador.create({
      nome: nome,
      email: email,
      palavra_passe: hashedPassword,
      foto,
      id_facebook: id,
      estado: true,
      isPrimeiroLogin: true,
      ultimoLogin: horaAtual
    });

    const token = gerarToken(novoUser);

    await enviarEmail({
      email,
      subject: 'Bem-vindo ao Softshares',
      message: `A sua conta foi criada com sucesso. Aqui está a sua palavra-passe temporária: ${password}. Irá atualizá-la após o login.`
    });

    return { token, message: 'Conta criada com sucesso.' };
  } catch (error) {
    console.error('Erro ao criar conta com Facebook:', error);
    throw new Error('Erro ao criar conta com Facebook');
  }
};