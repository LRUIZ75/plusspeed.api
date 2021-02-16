'use strict'


var generalSettings = require('../models/generalsettings.model');
var validator = require('validator');


var generalsettingsController = {

    getSettings: (req, res) => {
        generalSettings.find((err, settings) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: err.message
                })
                );
            }

            if (!settings || settings.length == 0) {
                return (res.status(404).send({
                    status: "error",
                    message: "No existen datos en GeneralSettings",
                    links: [{ "Add Settings": "http://localhost:3900/addsettings" }]
                }

                ));
            } else {
                return (res.status(200).send({
                    status: "ok",
                    settings
                }));
            }



        });
    },

    addsettings: (req, res) => {
        var data = req.body;
        //console.log(req.body);
        //console.log(" JSONDATA: " + data);


        //SIN PARAMETROS
        if (!data) {

            return (res.status(400).send({
                status: "error",
                messager: "No se incluye JSON GeneralSettings"
            })
            );
        }

        var gSettings = new generalSettings();


        try {
            
            gSettings = JSON.parse(data);
            
        } catch {
            //JSON INCORRECTO
            gSettings.franchiseName = " Valor Requerido";
            return (res.status(400).send({
                status: "error",
                message: "JSON Incorrecto",
                gSettings,
                data,
            }));
        }


        //INTENTAR GUARDAR EL NUEVO OBJETO
        gSettings.save((err, storedSettings) => {
            if (err) {
                return (res.status(400).send({
                    status: "error",
                    message: err.message,
                    source: "Al intentar guardar un nuevo GeneralSetting",
                    storedSettings
                }));

            } else {
                if (!storedSettings) {
                    return (res.status(400).send({
                        status: "error",
                        message: "No ",
                    }));
                }
                return (res.status(201).send({
                    status: "ok",
                    newsettings: storedSettings
                }));
            }

        });
    },

    setlogo: (req,res) => {
        

    }

}

module.exports = generalsettingsController;