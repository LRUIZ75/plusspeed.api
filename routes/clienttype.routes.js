
'use strict'

var express = require('express');

const { verify } = require('../middelware/access.middleware');

var clienttypeController = require('../controllers/clienttype.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// CLIENTTYPE
router.post('/clienttype', verify, clienttypeController.addClientType); //CREATE


router.put('/clienttype/:id', verify, clienttypeController.editClientType); //UPDATE

router.get('/clienttype/:id?', verify,clienttypeController.getClientType); //RETRIEVE
router.get('/clienttype', verify, clienttypeController.getClientType); //RETRIEVE


router.delete('/clienttype/:id', verify, clienttypeController.deleteClientType); //DELETE


module.exports = router;