const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { uploadEventos } = require('../config/multer');
const auth = require('../middlewares/decodeJWT');


router.get('/', auth, eventoController.listarEventos);
router.get('/criados', auth, eventoController.eventosCriador);
router.get('/validar', auth, eventoController.EventosPorValidar);
router.put('/validar/:id', auth, eventoController.validarEvento);
router.post('/mobile', auth, uploadEventos.single('foto'), eventoController.CriarEventoMobile);
router.get('/mobile', eventoController.eventosMobile);
router.post('/', auth, uploadEventos.single('foto'), eventoController.CriarEvento);
router.delete('/:id', eventoController.apagarEvento);
router.get('/:id', eventoController.getEvento);
router.put('/:id', uploadEventos.single('foto'), eventoController.editarEvento);
router.get('/:id/inscricao', eventoController.getInscricaoEvento);
router.post('/inscrever/:id', auth, eventoController.inscreverEvento);
router.delete('/desinscrever/:id', auth, eventoController.desinscreverEvento);
router.get('/inscricao/:id', auth, eventoController.verificarInscricao);



module.exports = router;    