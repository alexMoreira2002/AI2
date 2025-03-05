const multer = require('multer');
const path = require('path');

// Configuração do Multer para eventos
const storageEventos = multer.diskStorage({
    destination: './uploads/eventos',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + '-' + path.basename(file.originalname, ext) + ext;
        cb(null, filename);
    }
});

// Configuração do Multer para estabelecimentos
const storageEstabelecimentos = multer.diskStorage({
    destination: './uploads/estabelecimentos',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + '-' + path.basename(file.originalname, ext) + ext;
        cb(null, filename);
    }
});

//Configuração do Multer para utilizadores
const storageUtilizadores = multer.diskStorage({
    destination: './uploads/utilizador',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + '-' + path.basename(file.originalname, ext) + ext;
        cb(null, filename);
    }
});

const storageAlbuns = multer.diskStorage({
    destination: './uploads/albuns',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + '-' + path.basename(file.originalname, ext) + ext;
        cb(null, filename);
    }
});

const uploadEventos = multer({ storage: storageEventos });
const uploadEstabelecimentos = multer({ storage: storageEstabelecimentos });
const uploadUtilizadores = multer({ storage: storageUtilizadores });
const uploadAlbuns = multer({ storage: storageAlbuns });

module.exports = {
    uploadEventos,
    uploadEstabelecimentos,
    uploadUtilizadores,
    uploadAlbuns
};