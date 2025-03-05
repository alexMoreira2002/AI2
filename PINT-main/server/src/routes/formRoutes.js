const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const auth = require('../middlewares/decodeJWT');


router.post('/:idEvento', auth, formController.criarFormulario);
router.get('/:idEvento', formController.getFormularioEvento);
router.put('/:id', auth, formController.editarFormulario);
router.delete('/:id', auth, formController.apagarFormulario);
router.post('/responder/:id', auth, formController.responderFormulario);
router.get('/respostas/:id', formController.getRespostasFormulario);

module.exports = router;