'use strict'

const mongoose = require('mongoose');
const validator = require('validator');


const Schema = mongoose.Schema;


const ClientSchema = Schema({
	clientName: String,
	clientType: String,
	description: String,
	logo: String,
	registerDate: Date,
	bussinessManageId: String,
	bussinessPhone: String,
	bussinessMobile: String,
	businessEmail: String,
	taxpayerIdentNumber: String,
	hqLocation: Map, //RouterNode
	hqAddress: String,
	currentSettingsId: mongoose.SchemaTypes.ObjectId,
	clientAccountingId: mongoose.SchemaTypes.ObjectId,
	isActive: Boolean
});




module.exports = mongoose.model('Client',ClientSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.