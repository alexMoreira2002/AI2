const express = require('express');
const router = express.Router();
const NotificacaoController = require('../controllers/notificacaoController');
const auth = require('../middlewares/decodeJWT');

router.get('/', auth, NotificacaoController.getNotificacoes);
router.post('/', auth, NotificacaoController.criarNotificacao);
router.delete('/', auth, NotificacaoController.apagarNotificacoes);
router.get('/contador', auth, NotificacaoController.contadorNotificacoes)
router.put('/lido', auth, NotificacaoController.marcarComoLidas);

module.exports = router;