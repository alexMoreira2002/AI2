const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Area = require('./areaModel');
const Utilizador = require('./utilizadorModel');
const Posto = require('./postoModel');

const Album = sequelize.define('Album', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    foto: DataTypes.STRING,
    idArea: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Area',
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
    idPosto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posto',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Album.belongsTo(Area, { foreignKey: 'idArea' });
Album.belongsTo(Utilizador, { foreignKey: 'idCriador' });
Album.belongsTo(Posto, { foreignKey: 'idPosto' });

module.exports = Album;