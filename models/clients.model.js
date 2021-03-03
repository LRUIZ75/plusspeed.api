'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const ClientSchema = Schema({
    clientName:
      { type: String },
    clientType:
      { type: String },
    logo:
      { type: String },
    registerDate:
      { type: Date },
    bussinessManageId:
      { type: String },
    bussinessPhone:
      { type: String },
    bussinessMobile:
      { type: String },
    bussinessEmail:
      { type: String },
    taxPayerNumber:
      { type: String },
    hqLocation:
      { type: Map },
    hqAddress:
      { type: String },
    currentSettingsId:
      { type: String },
    clientAccountingId:
      { type: String },
    isActive:
      { type: Boolean }
    
});

//ToDo: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       properties: 
 *         clientName:
 *           type: "string"
 *         clientType:
 *           type: "string"
 *         logo:
 *           type: "string"
 *         registerDate:
 *           type: "string"
 *           format: "date"
 *         bussinessManageId:
 *           type: "string"
 *         bussinessPhone:
 *           type: "string"
 *         bussinessMobile:
 *           type: "string"
 *         bussinessEmail:
 *           type: "string"
 *         taxPayerNumber:
 *           type: "string"
 *         hqLocation:
 *           type: "object"
 *         hqAddress:
 *           type: "string"
 *         currentSettingsId:
 *           type: "string"
 *         clientAccountingId:
 *           type: "string"
 *         isActive:
 *           type: "boolean"
 *
 */

module.exports = mongoose.model('Client',ClientSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

