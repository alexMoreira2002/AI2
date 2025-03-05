const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Utilizador = require('./utilizadorModel');
const Evento = require('./eventoModel');

const Inscricao = sequelize.define('Inscricao', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idEvento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Evento',
      key: 'id'
    }
  },
  idUtilizador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Utilizador',
      key: 'id'
    }
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Utilizador',
      key: 'id'
    }
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, 
{
  freezeTableName: true,
  timestamps: false
});

Inscricao.belongsTo(Evento, { foreignKey: 'idEvento', as: 'evento' });
Inscricao.belongsTo(Utilizador, { foreignKey: 'idUtilizador', as: 'utilizador' });
Inscricao.belongsTo(Utilizador, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = Inscricao;