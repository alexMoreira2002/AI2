const express = require('express');
const router = express.Router();
const estatisticaController = require('../controllers/estatisticaController');
const auth = require('../middlewares/decodeJWT');

router.get('/eventos/:areaId', auth, estatisticaController.eventosPorAreaPosto);
router.get('/estabelecimentos/:areaId', auth, estatisticaController.estabelecimentosPorAreaPosto);
router.get('/eventos', auth, estatisticaController.contadorEventosPorArea);
router.get('/estabelecimentos', auth, estatisticaController.contadorEstabelecimentosPorArea);
router.get('/mais-avaliados', estatisticaController.maisAvaliados);
router.get('/por-validar', estatisticaController.fotosPorValidar);
router.get('/foto-evento', estatisticaController.fotoEventosPorValidar);
router.get('/foto-estabelecimento', estatisticaController.fotoEstabelecimentosPorValidar);
router.delete('/foto-evento/:id', estatisticaController.apagarFotoEvento);
router.delete('/foto-estabelecimento/:id', estatisticaController.apagarFotoEstabelecimento);
router.put('/foto-evento/:id', auth, estatisticaController.validarFotoEvento);
router.put('/foto-estabelecimento/:id', auth, estatisticaController.validarFotoEstabelecimento);


module.exports = router;