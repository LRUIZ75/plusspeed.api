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

/**
 * @swagger
 * components:
 *   schemas:
 *     GeneralSettings:
 *       properties: 
 *         franchiseName:
 *           type: "string"
 *           required: "true"
 *         franchiseLogo:
 *           type: "string"
 *           default: null
 *         clientInvoicesDueDays:
 *           type: "integer"
 *           default: "7"
 *         TIN:
 *           type: "string"
 *         address:
 *           type: "string"
 *         invoicesFooter:
 *           type: "string"
 *         invoicesCurrencyName:
 *           type: "string"
 *           default: "USD"
 *         payInstructions:
 *           type: "string"
 *           default: "Payment instructions here"
 *         isActive:
 *           type: "boolean"
 *           default: false
 */



module.exports = mongoose.model('GeneralSetting',GeneralSettingsSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.