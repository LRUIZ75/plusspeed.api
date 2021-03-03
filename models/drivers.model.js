'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const DriverSchema = Schema({
    userId:
      { type: String,
      required: true },
    mobile:
      { type: String,
      required: true },
    homeAddress:
      { type: String },
    homeLocation:
      { type: Map },
    vehicleType:
      { type: String },
    plateNumber:
      { type: String },
    vehicleDocumentsPictures:
      { type: [String] },
    driversLicenseExpirationDate:
      { type: Date },
    currentPostion:
      { type: Map },
    isActive:
      { type: Boolean },
    isAvailable:
      { type: Boolean }
    
});

//ToDo: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       properties: 
 *         userId:
 *           type: "string"
 *         mobile:
 *           type: "string"
 *         homeAddress:
 *           type: "string"
 *         homeLocation:
 *           type: "object"
 *         vehicleType:
 *           type: "string"
 *         plateNumber:
 *           type: "string"
 *         vehicleDocumentsPictures:
 *           type: "array"
 *           items:
 *             type: "string"
 *         driversLicenseExpirationDate:
 *           type: "string"
 *           format: "date"
 *         currentPostion:
 *           type: "object"
 *         isActive:
 *           type: "boolean"
 *         isAvailable:
 *           type: "boolean"
 *
 */

module.exports = mongoose.model('Driver',DriverSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

