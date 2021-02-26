
'use strict'

const mongoose = require('mongoose');

const validator = require('validator');


const Schema = mongoose.Schema;


const DriverSchema = Schema({
    userId: mongoose.SchemaTypes.ObjectId,
	mobile: String,
	homeAddress: String,
	homeLocation: Map,
	vehicleType: String, //requiere enumeracion
	plateNumber: String,
	vehiclePicture: String,
	platePicture: String,
	vehicleDocumentsPictures: [String],
	driversLicenseExpirationDate: Date,
	vehicleInsuranceExpirationDate: Date,
	vehicleLicenseExpirationDate: Date,
	policeRecordPictures: [String],
	policeRecordExpirationDate: Date,
	currentPosition: Map, //RouteNode Object
	aprovalDate: Date,
	aprovedByUserId: Number,
	isActive: Boolean,
	isAvailable: Boolean
});




module.exports = mongoose.model('Driver',DriverSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.


