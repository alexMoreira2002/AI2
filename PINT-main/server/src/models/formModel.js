const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Evento = require('./eventoModel');

const Formulario = sequelize.define('Formulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    campos: {
        type: DataTypes.JSONB, 
        allowNull: false,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    textoAuxiliar: {
        type: DataTypes.STRING,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    idEvento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Evento,
            key: 'id',
        },
    },
}, {
    tableName: 'Formulario',
    timestamps: false,
    freezeTableName: true,
});

Formulario.belongsTo(Evento, { foreignKey: 'idEvento' });

module.exports = Formulario;
