'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GeneralSettingsSchema = Schema({
    franchiseName: {type: String, required:[true, 'campo requerido']},
	franchiseLogo: {type: String},
	clientInvoicesDueDays: {type: Number, default:7},
	TIN: {type: String},
	address: {type: String},
	invoicesFooter: {type: String},
	invoicesCurrencyName: {type: String, default:"USD"},
	payInstructions: {type: String, default:"Payment instructions here"},
	isActive: {type:Boolean, default: false}
	
});



module.exports = mongoose.model('GeneralSetting',GeneralSettingsSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.