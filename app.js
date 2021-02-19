'use strict'

// Cargar módulos de node para crear el servidor
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
var bodyParser = require('body-parser');
var express = require('express');

// Ejecutar expresss (htpp)
var app = express();

global.baseURL ='localhost';

// Cargar ficheros rutas
var appRoutes = require('./routes/app.routes');


// Middlewares

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




// app.use(function (req, res, next) {
//   res.setHeader(
//     'Content-Security-Policy-Report-Only',
//     "default-src 'self'; font-src 'self'; img-src 'self' https://images.unsplash.com; script-src 'self'; style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css; frame-src 'self'"
//   );
//   next();
// });


// Activar CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
global.baseURL = req.hostname;
next();
});


app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Añadir prefijos a las rutas / Cargar rutas
app.use('/api', appRoutes);

// /* Endpoints */
// require('./src/endpoints')(app);

 
// Exportar módulo (fichero actual)
module.exports = app;
