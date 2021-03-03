
'use strict'

var express = require('express');

const { verify } = require('../middelware/access.middleware');

var clientController = require('../controllers/clients.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logos/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// CLIENT
router.post('/client', verify, clientController.addClient); //CREATE

router.put('/client/picture/:id', [verify, md_uploadpictures], clientController.setPicture); //UPDATE IMAGE 
router.put('/client/:id', verify, clientController.editClient); //UPDATE

router.get('/client/:id?', verify,clientController.getClient); //RETRIEVE
router.get('/client', verify, clientController.getClient); //RETRIEVE
router.get('/client/picture/:filename', clientController.getPicture); //RETRIEVE IMAGE 

router.delete('/client/:id', verify, clientController.deleteClient); //DELETE


module.exports = router;