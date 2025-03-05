const express = require('express');
const router = express.Router();
const estabelecimentoController = require('../controllers/estabelecimentoController');
const { uploadEstabelecimentos } = require('../config/multer');
const auth = require('../middlewares/decodeJWT');

// /estabelecimentos
router.get('/', auth, estabelecimentoController.listarEstabelecimentos);
router.get('/validar', auth, estabelecimentoController.EstabelecimentosPorValidar);
router.put('/validar/:id', auth, estabelecimentoController.validarEstabelecimento);
router.get('/mobile', estabelecimentoController.estabelecimentosMobile); 
router.post('/', auth, uploadEstabelecimentos.single('foto'), estabelecimentoController.criarEstabelecimento);
router.post('/mobile', auth, uploadEstabelecimentos.single('foto'), estabelecimentoController.criarEstabelecimentoMobile);
router.put('/:id', uploadEstabelecimentos.single('foto'), estabelecimentoController.editarEstabelecimento);
router.get('/:id', estabelecimentoController.getEstabelecimento);
router.delete('/:id', estabelecimentoController.apagarEstabelecimento);

//precos 
router.put('/:idEstabelecimento/precos', estabelecimentoController.adicionarPreco);


module.exports = router;
