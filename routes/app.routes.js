'use strict'


var express = require('express');

var generalsettingsController = require('../controllers/generalsettings.controller');
var personsController  = require('../controllers/persons.controller');
var usersController = require('../controllers/users.controller');
var clientsController = require('../controllers/clients.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadlogos = multipart({uploadDir: './uploads/logos'});
var md_uploadpictures = multipart({uploadDir: './uploads/pictures'});


/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



//SETTINGS

router.post('/settings', generalsettingsController.addSettings); //CREATE

router.put('/settings/logo/:id', md_uploadlogos, generalsettingsController.setLogo); //UPDATE
router.put('/settings/:id', generalsettingsController.editsettings); //UPDATE

router.get('/settings/:id?',generalsettingsController.getSettings); //RETRIEVE
router.get('/settings/logo/:filename',generalsettingsController.getLogo); //RETRIEVE
router.get('/settings',generalsettingsController.getSettings); //RETRIEVE

router.delete('/settings/:id',generalsettingsController.deleteSettings); //DELETE

//PERSONS
router.post('/persons', personsController.addPerson); //CREATE

router.put('/persons/picture/:id', md_uploadpictures, personsController.setPicture); //UPDATE
router.put('/persons/:id', personsController.editPerson); //UPDATE

router.get('/persons/:id?',personsController.getPersons); //RETRIEVE
router.get('/persons',personsController.getPersons); //RETRIEVE
router.get('/persons/picture/:filename',personsController.getPicture); //RETRIEVE

router.delete('/persons/:id',personsController.deletePerson); //DELETE



// USERS
router.post('/users', usersController.addUsers); //CREATE

//router.put('/users/picture/:id', md_uploadpictures, usersController.setPicture); //UPDATE
router.put('/users/:id', usersController.editUsers); //UPDATE

router.get('/users/:id?',usersController.getUsers); //RETRIEVE
router.get('/users',usersController.getUsers); //RETRIEVE
//router.get('/users/picture/:filename',usersController.getPicture); //RETRIEVE

router.delete('/users/:id',usersController.deleteUsers); //DELETE



// CLIENTS
router.post('/clients', clientsController.addClients); //CREATE

router.put('/clients/logo/:id', md_uploadlogos, clientsController.setPicture); //UPDATE
router.put('/clients/:id', clientsController.editClients); //UPDATE 

router.get('/clients/:id?',clientsController.getClients); //RETRIEVE
router.get('/clients',clientsController.getClients); //RETRIEVE
router.get('/clients/logo/:filename',clientsController.getPicture); //RETRIEVE

router.delete('/clients/:id',clientsController.deleteClients); //DELETE 




module.exports = router;