'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GeneralSettingsSchema = Schema({
    franchiseName: {type: String, require:true},
	franchiseLogo: {type: String, default:null},
	clientInvoicesDueDays: {type: Number, default:7},
	TIN: {type: String, default:null},
	address: {type: String, default:null},
	invoicesFooter: {type: String, default:null},
	invoicesCurrencyName: {type: String, default:"USD"},
	payInstructions: {type: String, default:"Pay instructions here"},
	
});



module.exports = mongoose.model('GeneralSettings',GeneralSettingsSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.