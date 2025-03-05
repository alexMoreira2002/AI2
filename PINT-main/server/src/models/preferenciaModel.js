const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Utilizador = require('./utilizadorModel');
const Area = require('./areaModel');
const Subarea = require('./subareaModel');

const Preferencia = sequelize.define('Preferencia', {
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
    idArea: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Area',
            key: 'id'
        }
    },
    idSubarea: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Subarea',
            key: 'id'
        }
    },
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['idUtilizador', 'idArea', 'idSubarea']
        }
    ]
});

Preferencia.belongsTo(Utilizador, { foreignKey: 'idUtilizador', as: 'utilizador' });
Preferencia.belongsTo(Area, { foreignKey: 'idArea', as: 'area' });
Preferencia.belongsTo(Subarea, { foreignKey: 'idSubarea', as: 'subarea' });

module.exports = Preferencia;