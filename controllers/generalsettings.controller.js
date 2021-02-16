'use strict'


var generalSettings = require('../models/generalsettings.model');
var validator = require('validator');
var fs = require('fs');
var path = require('path');


var generalsettingsController = {


    getSettings: (req, res) => {
        generalSettings.find((err, settings) => {
            // #swagger.tags = ['User']
            // #swagger.description = 'OBTENER LISTA DE CONFIGURACIONES GENERALES.'
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
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: 'Settings' 
        } */
                return (res.status(200).send({
                    status: "ok",
                    settings
                }));
            }



        });
    },

    addsettings: (req, res) => {
        var data = req.body;

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

            gSettings = new generalSettings(data);

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

    editsettings: (req, res) => {
        var data = req.body;

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
                return (res.status(500).send({
                    status: "error",
                    message: err.message,
                    source: "Al intentar guardar un nuevo GeneralSetting",
                    storedSettings
                }));

            } else {
                if (!storedSettings) {
                    return (res.status(500).send({
                        status: "error",
                        message: "No ",
                    }));
                }
                return (res.status(200).send({
                    status: "ok",
                    newsettings: storedSettings
                }));
            }

        });
    },

    setlogo: (req, res) => {

        //Configurar módulo connect multparty

        //recojer fichero de petición
        var file_name = 'Imagen no proporcionada...';

        // console.log(req.files);

        if (!req.files.logo) {
            return res.status(400).send({
                status: 'error',
                message: 'No hay parametro: logo',
                file_name
            });
        }
        //conseguir nombre y extensión del archivo
        var file_path = req.files.logo.path;

        var file_name = path.basename(file_path);

        var file_ext = path.extname(file_name);


        console.log(file_ext);

        switch (file_ext) {
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                //Archivo aceptable
                var settingsId = req.params.id;
                generalSettings.findOneAndUpdate({ _id: settingsId }, { franchiseLogo: file_name }, { new: true }, (err, settingsUpdated) => {

                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar logo en GeneralSettings',
                            file_name
                        });
                    }

                    return res.status(200).send({
                        status: 'ok',
                        updated: settingsUpdated
                    });
                });
                break;

            default:
                //Archivo no aceptado

                //Borrar el archivo

                fs.unlink(file_path, (err) => {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Tipo de archivo no es imagen y no pudo ser borrado!!',
                        file_name
                    });


                });

                return res.status(200).send({
                    status: 'error',
                    message: 'Tipo de archivo no es imagen. El archivo ha sido borrado!!',
                    file_name
                });
                break;
        };
    }

}

module.exports = generalsettingsController;