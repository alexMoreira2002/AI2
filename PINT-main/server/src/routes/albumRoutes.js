const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const { uploadAlbuns } = require('../config/multer');
const auth = require('../middlewares/decodeJWT');



router.get('/validar', albumController.albumsFalse);
router.put('/:id/validar', albumController.validarAlbum);
router.get('/validar/fotos', albumController.fotosFalse);
router.put('/validar/fotos/:id', albumController.validarFoto);

router.get('/', albumController.listarAlbums);
router.get('/:id', albumController.getAlbum);
router.post('/', auth, uploadAlbuns.single('foto'), albumController.criarAlbum);
router.put('/:id', uploadAlbuns.single('foto'), albumController.editarAlbum);
router.delete('/:id', albumController.apagarAlbum);

router.get('/:id/fotos', albumController.getFotosAlbum);
router.post('/:id/fotos', auth, uploadAlbuns.single('foto'), albumController.adicionarFotoAlbum);
router.put('/:id/fotos', uploadAlbuns.single('foto'), albumController.editarFotoAlbum);
router.delete('/:id/fotos', albumController.apagarFotoAlbum);


module.exports = router;