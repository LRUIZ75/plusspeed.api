'use strict'


global.PORT = process.env.PORT || 5000

var mongoose = require('mongoose');
var app = require('./app');






mongoose.set('useUnifiedTopology', true); //new
//mongoose.set('useFindAndModify', false); //deprecated 

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://admin:anunaki75@cluster0.qoekj.mongodb.net/velozz?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(
        () => {
            console.log("\n");
            console.log('INFO: La conexión a la base de datos es correcta!!!');

            //Crear servidor y ponerme a escuchar peticiones HTTP
            app.listen(PORT, () => {
                console.log('INFO: Servidor corriendo en: https://' + global.baseURL+':'+global.PORT );
            })
        },
        (err) => { console.log("ERROR: " + err) }
    );


