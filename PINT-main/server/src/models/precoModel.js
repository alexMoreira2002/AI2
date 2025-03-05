const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Estabelecimento = require('./estabelecimentoModel');
const Preco = sequelize.define('Preco', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idEstabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estabelecimento',
            key: 'id'
        }
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Preco.belongsTo(Estabelecimento, { foreignKey: 'idEstabelecimento', as: 'estabelecimento' });

module.exports = Preco;