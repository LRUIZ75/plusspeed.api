﻿
'use strict'

var express = require('express');

const { verify } = require('../middelware/access.middleware');

var personController = require('../controllers/persons.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({ uploadDir: './uploads/picture/' });

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// PERSON
router.post('/person', verify, personController.addPerson); //CREATE

router.put('/person/picture/:id', [verify, md_uploadpictures], personController.setPicture); //UPDATE IMAGE 
router.put('/person/:id', verify, personController.editPerson); //UPDATE

router.get('/person/:id?', verify, personController.getPerson); //RETRIEVE
router.get('/person', verify, personController.getPerson); //RETRIEVE
router.get('/person/picture/:filename', personController.getPicture); //RETRIEVE IMAGE 

router.delete('/person/:id', verify, personController.deletePerson); //DELETE


module.exports = router;