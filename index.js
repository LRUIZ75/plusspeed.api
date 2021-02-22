'use strict'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

global.PORT = process.env.PORT || 5000

var mongoose = require('mongoose');
var app = require('./app');



const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

var uriMongoDB = 'mongodb://localhost:27017/plusspeed';

if(process.env.NODE_ENV == 'production')
  uriMongoDB = 'mongodb+srv://admin:anunaki75@cluster0.qoekj.mongodb.net/plusspeed?retryWrites=true&w=majority';

mongoose.Promise = global.Promise;

mongoose.connect(uriMongoDB, options)
    .then(
        () => {
            console.log("\n");
            console.log('INFO: La conexión a la base de datos es correcta!!!');
            console.log('INFO: La base de datos es: ' + uriMongoDB);

            //Crear servidor y ponerme a escuchar peticiones HTTP
            app.listen(PORT, () => {
                console.log('INFO: Escuchando peticiones en el puerto: ' + global.PORT );
            })
        },
        (err) => { console.log("ERROR: " + err) }
    );


