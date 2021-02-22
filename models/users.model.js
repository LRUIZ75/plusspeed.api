'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;



const UserSchema = Schema({

	userName: {
        type: String,
        required: [true,'Nombre de usuario requrido'],
        unique: true,
        minLength: 4,
        maxLength: 20,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        maxLength: 12,
        required: [true, 'La contraseña es requerida'],
    },
	personId: {
        type: mongoose.ObjectId,
        required: [true, "Datos de persona requeridos"]
    },
	registeredEmail: {
        type: String, 
        trim: true, 
        lowercase: true, 
        unique: true, 
        required:[true, 'El correo es requrido'],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} no es una dirección de correo válida',
            isAsync: false
        }
    }, 
	isVerifiedEmail: Boolean,
	ssoProviderId: mongoose.ObjectId,

	registrationDate: Date,
	pinOTP: String,
	pinOTPExpiration: Date,
	profilesNames: Array(String),
	clientId: mongoose.ObjectId,
	bearerToken: String,
	isLoggedOn: Boolean,
	lastLogOn: Date,
	isActive: Boolean,
	
});



module.exports = mongoose.model('User',UserSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.