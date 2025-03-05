const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Area = require('./areaModel');
const Subarea = require('./subareaModel');
const Posto = require('./postoModel');
const Utilizador = require('./utilizadorModel');

const Estabelecimento = sequelize.define('Estabelecimento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idArea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Area',
      key: 'id'
    }
  },
  idSubarea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subarea',
      key: 'id'
    }
  },
  idPosto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Posto',
      key: 'id'
    }
  },
  morada: {
    type: DataTypes.STRING,
    allowNull: true
  },
  descricao: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  foto: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  telemovel : {
    type: DataTypes.STRING,
    allowNull: true
  },
  email : {
    type: DataTypes.STRING,
    allowNull: true
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Utilizador',
      key: 'id'
    }
  },
  idCriador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Utilizador',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
},
{
  freezeTableName: true,
  timestamps: false
});

Estabelecimento.belongsTo(Area, {foreignKey: 'idArea'});
Estabelecimento.belongsTo(Subarea, {foreignKey: 'idSubarea'});
Estabelecimento.belongsTo(Posto, {foreignKey: 'idPosto'});
Estabelecimento.belongsTo(Utilizador, { as: 'admin', foreignKey: 'idAdmin' });
Estabelecimento.belongsTo(Utilizador, { as: 'criador', foreignKey: 'idCriador' });

module.exports = Estabelecimento;