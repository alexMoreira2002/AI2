const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Posto = sequelize.define('Posto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, 
{
  freezeTableName: true,
  timestamps: false
});

module.exports = Posto; 