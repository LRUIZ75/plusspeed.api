'use strict'

const os = require('os');
const generalsettingsModel = require('../models/generalsettings.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
var multipart = require('connect-multiparty');
var md_uploadsettings = multipart({ uploadDir: './uploads/logos' });




var generalsettingsController = {


    getSettings: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'LISTAR LAS CONFIGURACIONES GENERALES.'

        var settingsId = req.params.id;

        var query = { '_id': { $eq: settingsId } };

        if (!settingsId || settingsId === undefined) query = {};
        else query = { '_id': { $eq: settingsId } };

        console.log(query);


        generalsettingsModel.find(query, (err, settings) => {


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
                    message: "Registro(s) no encontrado(s)",
                    links: [{ "Agregar registro => curl -X POST ": global.baseURL + "/api/settings" }]
                }

                ));
            } else {
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>General Settings</b>' 
                } */

                return (res.status(200).send({
                    status: "ok",
                    generalsettings: settings
                }));
            }
        });
    },

    addSettings: (req, res) => {

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

        var gSettings = new generalsettingsModel(data);


        //INTENTAR GUARDAR EL NUEVO OBJETO
        gSettings.save((err, storedSettings) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));

            } else {
                if (!storedSettings) {
                    return (res.status(500).send({
                        status: "error",
                        message: "Al intentar guardar un nuevo registro",
                    }));
                }
                /* #swagger.responses[201] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>Creado</b>' 
                } */
                return (res.status(201).send({
                    status: "ok",
                    created: storedSettings
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
        generalsettingsModel.findOneAndUpdate(query, command, { new: true }, (err, storedSettings) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));

            } else {
                if (!storedSettings) {

                    return (res.status(404).send({
                        status: "error",
                        message: "No se encontró el registro"
                    }));
                }
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>Actualizado</b>' 
                } */
                return (res.status(200).send({
                    status: "ok",
                    updated: storedSettings
                }));
            }

        });
    },

    setLogo: (req, res) => {

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
        var settingsId = req.params.id;

        // console.log(req.files);

        if (!req.files.logo) {
            return res.status(400).send({
                status: 'error',
                message: 'No hay parametro: logo'
            });
        }
        if (!settingsId) {
            return res.status(400).send({
                status: 'error',
                message: 'No hay parámetro: Id'
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


                var query = { '_id': { $eq: settingsId } };
                var command = { $set: { 'franchiseLogo': file_name } };
                console.log(query);
                console.log(command);

                generalsettingsModel.findOneAndUpdate(query, command, { new: true }, (err, settingsUpdated) => {

                    if (err) {
                        fs.unlinkSync(file_path); 

                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar registro',
                            error: err
                        });
                    }

                    if (!settingsUpdated) {

                        fs.unlinkSync(file_path);

                        return res.status(404).send({
                            status: 'error',
                            message: 'Registro no encontrado'
                        });
                    }

                    /* #swagger.responses[200] = { 
                   description: '<b>Actualizado</b>' 
                    } */

                    return res.status(200).send({
                        status: 'ok',
                        updated: settingsUpdated
                    });
                });
                break;

            default:
                //Archivo no aceptado

                //Borrar el archivo

                fs.unlinkSync(file_path);

                return res.status(400).send({
                    status: 'error',
                    message: 'Tipo de archivo no es imagen.',
                    file_name
                });
                break;
        };
    },

    getLogo: (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'Obtener Logo'

        /* #swagger.parameters['filename'] = {
           description: 'Nombre de archivo imagen' ,
           type: 'string',
            required: true} 
        */

        var file = req.params.filename;
        if (validator.isEmpty(file)) {
            return (res.status(400).send({
                status: "error",
                message: "Falta nombre del archivo"
            }));
        }

        var path_file = './uploads/logos/' + file;

        fs.stat(path_file, (err) => {

            if (err) {

                return res.status(404).send({
                    status: 'error',
                    message: 'archivo no encontrado',
                    path: path_file
                });
            }

            /* #swagger.responses[200] = { 
               description: '<b>Archivo de Imagen</b>' 
            } */
            return res.status(200).sendFile(path.resolve(path_file));

        });

    },

    deleteSettings: (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'ELIMINAR DATOS DE CONFIGURACION GENERAL.'

        /* #swagger.parameters['id'] = {
           description: 'Id del registro en la coleccion' ,
           type: 'string',
        required: true} 
        */


        var id = req.params.id;


        if (!id) {

            return (res.status(400).send({
                status: "error",
                messager: "Falta el parámetro: Id"
            })
            );
        }

        var query = { '_id': { $eq: id } };
        console.log(query);

        //INTENTAR ACTUALIZAR  OBJETO
        generalsettingsModel.findOneAndDelete(query, { new: false }, (err, deletedSettings) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));

            } else {
                if (!deletedSettings) {

                    return (res.status(404).send({
                        status: "error",
                        message: "No fue posible eliminar el registro",
                    }));
                }
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>Borrado</b>' 
                } */
                return (res.status(200).send({
                    status: "ok",
                    deleted: deletedSettings
                }));
            }

        });
    }


}

module.exports = generalsettingsController;