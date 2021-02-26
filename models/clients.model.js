'use strict'

const mongoose = require('mongoose');
const validator = require('validator');


const Schema = mongoose.Schema;


const ClientSchema = Schema({
	clientName: String,
	clientTypeId: String,
	description: String,
	logo: String,
	registerDate: Date,
	bussinessManageId: String,
	bussinessPhone: String,
	bussinessMobile: String,
	businessEmail: String,
	taxpayerIdentNumber: String,
	hqLocation: String,
	hqAddress: String,
	currentSettingsId: String,
	clientAccountingId: String,
	isActive: Boolean
});




module.exports = mongoose.model('Client',ClientSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.