const express = require('express');
const router = express.Router();
const denunciaController = require('../controllers/denunciaController');
const auth = require('../middlewares/decodeJWT');

router.get('/', denunciaController.listarDenuncias);
router.post('/', auth, denunciaController.criarDenuncia);
router.put('/validar/:id', denunciaController.validarDenuncia);
router.delete('/:id', denunciaController.apagarDenuncia);

module.exports = router;