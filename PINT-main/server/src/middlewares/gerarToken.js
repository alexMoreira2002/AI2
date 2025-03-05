const jwt = require('jsonwebtoken');

function gerarToken(user) {
  const payload = {
    id: user.id,
    nome: user.nome,
    nif: user.nif,
    localidade: user.localidade,
    telemovel: user.telemovel,
    email: user.email,
    cargo: user.cargo,
    idPosto: user.idPosto,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  return token;
}

module.exports = gerarToken;