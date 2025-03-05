const express = require('express');
const router = express.Router();
const estabelecimentoController = require('../controllers/estabelecimentoController');
const eventoController = require('../controllers/eventoController');
const utilizadorController = require('../controllers/utilizadorController');
const { uploadEstabelecimentos, uploadEventos, uploadUtilizadores} = require('../config/multer');


router.get('/estabelecimentos/:id', estabelecimentoController.getFotoEstabelecimento);
router.get('/eventos/:id', eventoController.getFotoEvento);
router.post('/estabelecimentos/:id', uploadEstabelecimentos.single('foto'), estabelecimentoController.uploadFotoEstabelecimento);
router.delete('/estabelecimentos/:id', estabelecimentoController.deleteFotoEstabelecimento);
router.post('/eventos/:id', uploadEventos.single('foto'), eventoController.uploadFotoEvento);
router.delete('/eventos/:id', eventoController.deleteFotoEvento);
router.get('/utilizador/:id', utilizadorController.getFotoUtilizador);
router.post('/utilizador/:id', uploadUtilizadores.single('foto'), utilizadorController.uploadFotoUtilizador);
router.delete('/utilizador/:id', utilizadorController.deleteFotoUtilizador);





module.exports = router;