const express = require('express');
const router = express.Router();
const utilizadorController = require('../controllers/utilizadorController');
const auth = require('../middlewares/decodeJWT');
const { uploadUtilizadores } = require('../config/multer');

router.get('/', auth, utilizadorController.getUtilizador);
router.get('/completo', auth, utilizadorController.getUtilizadorCompleto);
router.get('/todos', utilizadorController.getUtilizadores);
router.get('/:id', utilizadorController.utilizadorPorId);
router.post('/registar', utilizadorController.registar);
router.post('/', utilizadorController.criarUtilizador);
router.put('/:id', uploadUtilizadores.single('foto'), utilizadorController.atualizarUtilizador);
router.put('/:id/preferencias', utilizadorController.associarPreferencias);
router.delete('/:id', utilizadorController.apagarUtilizador);
router.post('/associar-posto', auth, utilizadorController.associarPosto);
router.get('/inscricao/:id', utilizadorController.listarInscricoes);

module.exports = router;