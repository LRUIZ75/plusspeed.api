'use strict'


var express = require('express');

var rootrouter = express.Router();

var multipart = require('connect-multiparty');

rootrouter.all("/*",function(req,res,next){
    res.redirect(302,"/doc");
    next();
});

module.exports = rootrouter;