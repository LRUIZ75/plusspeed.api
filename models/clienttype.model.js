'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const ClientTypeSchema = Schema({
    name:
      { type: String },
    allowAisleBrowsing:
      { type: Boolean }
    
});

//ToDo: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     ClientType:
 *       properties: 
 *         name:
 *           type: "string"
 *         allowAisleBrowsing:
 *           type: "boolean"
 *
 */

module.exports = mongoose.model('ClientType',ClientTypeSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

