const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Utilizador = require('./utilizadorModel');
const Formulario = require('./formModel');

const Resposta = sequelize.define('Resposta', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idFormulario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Formulario',
            key: 'id',
        },
    },
    respostas: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    idUtilizador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilizador',
            key: 'id',
        },
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
    }, 
    {
    freezeTableName: true,
    timestamps: false
});

Resposta.belongsTo(Formulario, { foreignKey: 'idFormulario' });
Resposta.belongsTo(Utilizador, { foreignKey: 'idUtilizador' });


module.exports = Resposta;

