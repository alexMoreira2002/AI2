const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Evento = require('./eventoModel');
const Utilizador = require('./utilizadorModel');

const FotoEvento = sequelize.define('FotoEvento', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idEvento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Evento',
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
    idAdmin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Utilizador',
            key: 'id'
        }
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

FotoEvento.belongsTo(Evento, { foreignKey: 'idEvento', as: 'evento' });
FotoEvento.belongsTo(Utilizador, { foreignKey: 'idCriador', as: 'criador' });
FotoEvento.belongsTo(Utilizador, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = FotoEvento;