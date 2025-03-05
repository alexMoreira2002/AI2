const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Utilizador = require('./utilizadorModel');
const AvaliacaoEstabelecimento = require('./avaliacaoEstabelecimentoModel');
const AvaliacaoEvento = require('./avaliacaoEventoModel');

const Voto = sequelize.define('Voto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idUtilizador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Utilizador,
      key: 'id'
    }
  },
  idEstabelecimento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: AvaliacaoEstabelecimento,
      key: 'id'
    }
  },
  idEvento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: AvaliacaoEvento,
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

Voto.belongsTo(Utilizador, { foreignKey: 'idUtilizador' });

module.exports = Voto;
