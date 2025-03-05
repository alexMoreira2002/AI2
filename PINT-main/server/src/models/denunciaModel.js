const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Utilizador = require('./utilizadorModel');
const AvaliacaoEvento = require('./avaliacaoEventoModel');
const AvaliacaoEstabelecimento = require('./avaliacaoEstabelecimentoModel');

const Denuncia = sequelize.define('Denuncia', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idCriador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilizador',
            key: 'id'
        }
    },
    idAvaliacaoEvento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'AvaliacaoEvento',
            key: 'id'
        }
    },
    idAvaliacaoEstabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'AvaliacaoEstabelecimento',
            key: 'id'
        }
    },
}, {
    freezeTableName: true,
    timestamps: false
});

Denuncia.belongsTo(Utilizador, { foreignKey: 'idCriador', as: 'criador' });
Denuncia.belongsTo(AvaliacaoEvento, { foreignKey: 'idAvaliacaoEvento', as: 'avaliacaoEvento' });
Denuncia.belongsTo(AvaliacaoEstabelecimento, { foreignKey: 'idAvaliacaoEstabelecimento', as: 'avaliacaoEstabelecimento' });
Denuncia.belongsTo(Utilizador, { foreignKey: 'idAdmin', as: 'admin' });

module.exports = Denuncia;