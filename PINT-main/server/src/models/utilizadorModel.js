const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Posto = require('./postoModel');
const Area = require('./areaModel');
const Subarea = require('./subareaModel');

const Utilizador = sequelize.define('Utilizador', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: DataTypes.STRING,
  descricao: DataTypes.STRING(1000),
  nif: DataTypes.STRING,
  localidade: DataTypes.STRING,
  telemovel: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  palavra_passe: DataTypes.STRING,
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  foto: DataTypes.STRING,
  id_google: DataTypes.STRING,
  id_facebook: DataTypes.STRING,
  cargo: DataTypes.STRING,
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPrimeiroLogin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recoveryToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Utilizador', 
      key: 'id',
      defaultValue: null
    }
  },
  idPosto : {
    type: DataTypes.INTEGER,
    references: {
      model: 'Posto',
      key: 'id',
      defaultValue: null
    }
  },
  idArea: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Area',
      key: 'id',
      defaultValue: null
    }
  },
  idSubarea: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Subarea',
      key: 'id',
      defaultValue: null
    }
  },
  ultimoLogin: {
    type: DataTypes.DATE,
    allowNull: true, 
    defaultValue: null, 
  }
}, 
{
  freezeTableName: true,
  timestamps: false
});

Utilizador.belongsTo(Posto, {foreignKey: 'idPosto'});
Utilizador.belongsTo(Area, {foreignKey: 'idArea'});
Utilizador.belongsTo(Subarea, {foreignKey: 'idSubarea'});

module.exports = Utilizador;