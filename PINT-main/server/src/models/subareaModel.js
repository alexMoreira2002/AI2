const { DataTypes, BelongsTo } = require('sequelize');
const { sequelize } = require('../utils/database');
const Area = require('./areaModel');

const Subarea = sequelize.define('Subarea', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idArea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Area',
      key: 'id'
    }
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  },
  {
    freezeTableName: true,
    timestamps: false
  });

Subarea.belongsTo(Area, {foreignKey: 'idArea'});

module.exports = Subarea;
  
