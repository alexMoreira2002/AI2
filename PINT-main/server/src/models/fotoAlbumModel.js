const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Album = require('./albumModel');
const Utilizador = require('./utilizadorModel');

const FotoAlbum = sequelize.define('FotoAlbum', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idAlbum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Album',
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
    foto: DataTypes.STRING,
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Sem descrição'
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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

FotoAlbum.belongsTo(Album, { foreignKey: 'idAlbum' });
FotoAlbum.belongsTo(Utilizador, { foreignKey: 'idCriador', as: 'criador' });

module.exports = FotoAlbum;