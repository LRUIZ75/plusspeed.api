'use strict'


var express = require('express');

var generalsettingsController = require('../controllers/generalsettings.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadsettings = multipart({uploadDir: './upload/settings'});


router.get('/getsettings',generalsettingsController.getSettings);
router.post('/addsettings', generalsettingsController.addsettings);
router.post('/setlogo:logo', md_uploadsettings, generalsettingsController.setlogo);



// router.post('/save',ArticleController.save);
// router.get('/articles/:last?',ArticleController.getArticles);
// router.get('/article/:id',ArticleController.getArticle);
// router.put('/article/:id',ArticleController.update);
// router.delete('/article/:id',ArticleController.delete);
// router.post('/upload-image/:id',md_upload, ArticleController.upload);
// router.get('/get-image/:image',ArticleController.getImage);
// router.get('/search/:search',ArticleController.search);


module.exports = router;