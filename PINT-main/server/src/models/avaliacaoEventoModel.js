const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Utilizador = require('./utilizadorModel');
const Evento = require('./eventoModel');

const AvaliacaoEvento = sequelize.define('AvaliacaoEvento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  idEvento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Evento',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  classificacao: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  upvotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  downvotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  idPai: {
  type: DataTypes.INTEGER,
  allowNull: true, // Permitir null para comentários iniciais
  references: {
    model: 'AvaliacaoEvento',
    key: 'id'
  }
},
  comentario: DataTypes.TEXT
}, 
{
  freezeTableName: true,
  timestamps: false
});

AvaliacaoEvento.belongsTo(Evento, { foreignKey: 'idEvento', as: 'evento' });
AvaliacaoEvento.belongsTo(Utilizador, { foreignKey: 'idUtilizador', as: 'utilizador' });
AvaliacaoEvento.belongsTo(Utilizador, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = AvaliacaoEvento;