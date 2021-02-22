'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PersonSchema = Schema({

    names: {
        type: String, 
        minLength: 2,
        required:[true,'campo requerido']
    },
    surnames: {
        type: String, 
        minLength: 2,
        required:[true,'campo requerido']
    },
    idNumber: String,
    idType: {
        type: String,
        enum: ['Pasaporte','Cédula','Residencia','Licencia Conductor']
    },
    genre: {
        type: String, 
        enum: ['Hombre','Mujer', 'No binario',''], 
        default: ''
    },
    birthday: Date,
    picture: String
	
});

PersonSchema.virtual('fullName').get(function(){
    return this.names+ ' ' + this.surnames;
});


module.exports = mongoose.model('Person',PersonSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.