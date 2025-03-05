const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Estabelecimento = require('./estabelecimentoModel');
const Utilizador = require('./utilizadorModel');

const FotoEstabelecimento = sequelize.define('FotoEstabelecimento', {
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

FotoEstabelecimento.belongsTo(Estabelecimento, { foreignKey: 'idEstabelecimento', as: 'estabelecimento' });
FotoEstabelecimento.belongsTo(Utilizador, { foreignKey: 'idCriador', as: 'criador' });
FotoEstabelecimento.belongsTo(Utilizador, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = FotoEstabelecimento;