const express = require('express');
const port = 3001;
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); 
const path = require('path');
require ('dotenv').config();
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  next();
});

{ /* Carregar automaticamente as tabelas com dados pré-feitos, apenas retirar comentário para ativar e adicionar comentário outra vez depois */ } 
const carregarTabelas = require('./src/utils/carregarTabelas'); 
carregarTabelas();   


// Importação das rotas
const authRoutes = require('./src/routes/authRoutes'); 
const eventoRoutes = require('./src/routes/eventoRoutes');
const areaRoutes = require('./src/routes/areaRoutes');
const estabelecimentoRoutes = require('./src/routes/estabelecimentoRoutes');
const postoRoutes = require('./src/routes/postoRoutes');
const avaliacaoRoutes = require('./src/routes/avaliacaoRoutes');
const utilizadorRoutes = require('./src/routes/utilizadorRoutes');
const notificacaoRoutes = require('./src/routes/notificacaoRoutes');
const fotoRoutes = require('./src/routes/fotoRoutes');
const estatisticaRoutes = require('./src/routes/estatisticaRoutes');
const formRoutes = require('./src/routes/formRoutes');
const denunciaRoutes = require('./src/routes/denunciaRoutes'); 
const albumRoutes = require('./src/routes/albumRoutes');

// Rotas da API
app.use('/', authRoutes);
app.use('/eventos', eventoRoutes);
app.use('/areas', areaRoutes);
app.use('/estabelecimentos', estabelecimentoRoutes);
app.use('/postos', postoRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   
app.use('/avaliacao', avaliacaoRoutes);
app.use('/utilizador', utilizadorRoutes);
app.use('/foto', fotoRoutes);
app.use('/notificacao', notificacaoRoutes);
app.use('/estatistica', estatisticaRoutes);
app.use('/formulario', formRoutes);
app.use('/denuncia', denunciaRoutes);
app.use('/album', albumRoutes);



app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});