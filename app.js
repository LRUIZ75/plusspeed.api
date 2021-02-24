'use strict'


// Cargar módulos de node para crear el servidor
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
var bodyParser = require('body-parser');
var express = require('express');
const jwt = require('jsonwebtoken');

// Ejecutar expresss (htpp)
var app = express();

global.baseURL ='localhost';




// Cargar ficheros rutas
var appRoutes = require('./routes/app.routes');


process.env.SECRET_KEY = "xv2pXfdXV&aDs91P";

// Middlewares

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



// Activar CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
global.baseURL = req.hostname +":"+ global.PORT;
//console.log('INFO: Servidor corriendo en: ' + global.baseURL );
next();
});

app.disable('x-powered-by');

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Añadir prefijos a las rutas / Cargar rutas
app.use('/api', appRoutes);

// /* Endpoints */
// require('./src/endpoints')(app);

 
// Exportar módulo (fichero actual)
module.exports = app;
