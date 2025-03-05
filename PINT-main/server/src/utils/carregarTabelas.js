const Utilizador = require('../models/utilizadorModel');
const Area = require('../models/areaModel');
const Subarea = require('../models/subareaModel');
const Posto = require('../models/postoModel');
const Evento = require('../models/eventoModel');
const Estabelecimento = require('../models/estabelecimentoModel');
const AvaliacaoEstabelecimento = require('../models/avaliacaoEstabelecimentoModel');
const AvaliacaoEvento = require('../models/avaliacaoEventoModel');
const FotoEstabelecimento = require('../models/fotoEstabelecimentoModel');
const FotoEvento = require('../models/fotoEventoModel');
const Inscricao = require('../models/inscricaoModel');
const Notificacao = require('../models/notificacaoModel');
const Formulario = require('../models/formModel');
const Album = require('../models/albumModel');
const FotoAlbum = require('../models/fotoAlbumModel');
const { sequelize } = require('./database');

const utilizadores = [
  {
    nome: 'Alexandre Moreira',
    nif: '123456789',
    palavra_passe: '$2a$10$uD0hKNj4bXFQMtmB4XCNe.7scC5pkgddQvdYySm22nAPV0voT3ozO',
    localidade: 'Viseu',
    telemovel: '912345678',
    email: 'alex@email.com',
    estado: true,
    isAdmin: true,
    cargo: 'Lider de Marketing',
    ultimoLogin: '2024-07-17 00:07:50.918000 +00:00'
  },
];

const areas = [
  { nome: 'Saúde' , icone: 'LocalHospitalOutlined'},
  { nome: 'Desporto' , icone: 'SportsSoccerOutlined'},
  { nome: 'Formação', icone: 'SchoolOutlined'},
  { nome: 'Gastronomia', icone: 'RestaurantOutlined'},
  { nome: 'Alojamento', icone: 'BedOutlined'},
  { nome: 'Transportes', icone: 'DirectionsCarOutlined'},
  { nome: 'Lazer', icone: 'DeckOutlined' },
];

const subareas = [
  { idArea: 1, nome: 'Clínicas médicas e hospitais' },
  { idArea: 1, nome: 'Clinicas Dentárias' },
  { idArea: 2, nome: 'Ginásios' },
  { idArea: 2, nome: 'Atividades ao Ar Livre' },
  { idArea: 3, nome: 'Centros de Formação' },
  { idArea: 3, nome: 'Escolas' },
  { idArea: 4, nome: 'Restaurantes' },
  { idArea: 4, nome: 'Shoppings' },
  { idArea: 5, nome: 'Quartos para arrendar' },
  { idArea: 5, nome: 'Casas para alugar' },
  { idArea: 6, nome: 'Boleias' },
  { idArea: 6, nome: 'Transportes públicos' },
  { idArea: 7, nome: 'Cinema' },
  { idArea: 7, nome: 'Parques' },
];

const postos = [
  { nome: 'Viseu' },
  { nome: 'Tomar' },
  { nome: 'Fundão' },
  { nome: 'Portalegre' },
  { nome: 'Vila Real' },
];

const carregarTabelas = () => {
  sequelize.sync({ force: true })
    .then(() => {
      return Posto.bulkCreate(postos);
    })
    .then(() => {
      return Utilizador.bulkCreate(utilizadores);
    })
    .then(() => {
      return Area.bulkCreate(areas);
    })
    .then(() => {
      return Subarea.bulkCreate(subareas);
    })
    .catch((error) => {
      console.error('Erro ao carregar tabelas:', error);
    });
}

module.exports = carregarTabelas;
