'use strict'


var mongoose = require('mongoose');

var app = require('./app');

var port = 3900;



mongoose.set('useUnifiedTopology', true); //new
//mongoose.set('useFindAndModify', false); //deprecated 

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/velozz', { useNewUrlParser: true })

    .then(() => {
        console.log("\n");
        console.log('INFO: La conexión a la base de datos es correcta!!!');

        //Crear servidor y ponerme a escuchar peticiones HTTP
        app.listen(port, () => {
            console.log('INFO: Servidor corriendo en http://localhost:' + port);
        })
    });

