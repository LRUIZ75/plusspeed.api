'use strict'

const os = require('os');
var generalSettings = require('../models/generalsettings.model');
var validator = require('validator');
var fs = require('fs');
var path = require('path');
const { ObjectId } = require('mongodb');


var generalsettingsController = {


    getSettings: (req, res) => {

            // #swagger.tags = ['User']
            // #swagger.description = 'LISTAR LAS CONFIGURACIONES GENERALES.'

        var settingsId = req.params.id;
        
        var query={'_id': {$eq: settingsId}};

        if(!settingsId || settingsId===undefined) query = {};
        else query={'_id': {$eq: settingsId}};
        
        console.log(query);

        generalSettings.find(query,(err, settings) => {


            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: err.message
                })
                );
            }

            if (!settings || settings.length == 0) {
                /* #swagger.responses[404] = { 
               schema: { $ref: "#/definitions/NoSchema" },
               description: 'No hay elementos en la coleccion de configuraciones' 
                } */
                return (res.status(404).send({
                    status: "error",
                    message: "No encontrado",
                    links: [{ "Agregue una configuracion:": "/api/settings/create" }]
                }

                ));
            } else {
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>Se devuelve la coleccion de configuraciones</b>' 
                } */

                return (res.status(200).send({
                    status: "ok",
                    settings
                }));
            }
        });
    },

    addsettings: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'AGREGAR NUEVA CONFIGURACION GENERAL.'
        var data = req.body;

        /*
            #swagger.parameters['data'] = {
            in: "body",
            name: "data",
            type: "object",
            required: true
          }
        */

        //SIN PARAMETROS
        if (!data) {

            return (res.status(400).send({
                status: "error",
                messager: "Faltan parametros de request en formato JSON"
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
                        message: "Al intentar guardar un nuevo GeneralSetting",
                    }));
                }
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>Nuevo registro CREADO en generalsettings</b>' 
                } */
                return (res.status(201).send({
                    status: "ok",
                    newsettings: storedSettings
                }));
            }

        });
    },


    editsettings: (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'ACTULIZAR DATOS DE CONFIGURACION GENERAL.'
        var data = req.body;
        /* #swagger.parameters['id'] = {
           description: 'Id del registro en la coleccion' ,
           type: 'string',
        required: true} 
        */
        /*
            #swagger.parameters['data'] = {
            in: "body",
            name: "data",
            type: "object",
            required: true
          }
        */

        var id = req.params.id;

        if (!data) {

            return (res.status(400).send({
                status: "error",
                messager: "No se incluye JSON GeneralSettings"
            })
            );
        }

        if (!id) {

            return (res.status(400).send({
                status: "error",
                messager: "No se incluye id de GeneralSettings"
            })
            );
        }


        var query = { '_id': { $eq: id } };
        var command = { $set: data };
        console.log(query);
        console.log(command);



        //INTENTAR ACTUALIZAR  OBJETO
        generalSettings.findOneAndUpdate(query, command, { new: true }, (err, storedSettings) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: err.message,
                    source: "Al intentar guardar un nuevo GeneralSetting",
                    storedSettings
                }));

            } else {
                if (!storedSettings) {
                                    /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: 'No modificado</b>' 
                } */
                    return (res.status(304).send({
                        status: "error",
                        message: "No fue posible realizar la modificacion",
                    }));
                }
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>Registro actualizado en generalsettings</b>' 
                } */
                return (res.status(200).send({
                    status: "ok",
                    newsettings: storedSettings
                }));
            }

        });
    },

    setlogo: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'ACTUALIZAR EL LOGO DE UNA CONFIGURACION'

        /* #swagger.parameters['id'] = {
           description: 'Id del registro en la coleccion' ,
           type: 'string',
           required: true } 
        */
        /*
            #swagger.parameters['logo'] = {
            in: "formData",
            name: "logo",
            type: "file",
            required: true
          }
        */


        //description: 'Archivo grafico: PNG JPEG GIF' ,

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
                console.log(settingsId + ' ' + file_name);
                var query = { '_id': { $eq: settingsId } };
                var command = { $set: { 'franchiseLogo': file_name } };
                console.log(query);
                console.log(command);

                generalSettings.findOneAndUpdate(query, command, { new: true }, (err, settingsUpdated) => {

                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar logo en GeneralSettings',
                            error: err,
                            file_name
                        });
                    }

                    if (!settingsUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Objeto no encontrado',
                        });
                    }

                    /* #swagger.responses[200] = { 
                   description: '<b>Logo fue actualizado</b>' 
                    } */
                    console.log(settingsUpdated);
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
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>Logo actualizado en generalsettings</b>' 
                } */
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