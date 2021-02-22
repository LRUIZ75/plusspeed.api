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
                /* #swagger.responses[404] = { 
               schema: { $ref: "#/definitions/NoSchema" },
               description: 'No hay elementos en la coleccion de configuraciones' 
                } */
                return (res.status(404).send({
                    status: "error",
                    message: "No encontrado",
                    links: [{ "Agregar registro => curl -X POST ": global.baseURL + "/api/settings" }]
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
                    message: "Al intentar guardar un nuevo registro",
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
               description: '<b>Nuevo registro creado</b>' 
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
        generalsettingsModel.findOneAndUpdate(query, command, { new: true }, (err, storedSettings) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: "Error al intentar modificar registro",
                    error: err.message,
                }));

            } else {
                if (!storedSettings) {
                    /* #swagger.responses[304] = { 
                    description: 'No modificado' 
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
                message: 'No hay parametro: logo',
                file_name
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
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar logo en GeneralSettings',
                            error: err,
                            file_name
                        });
                    }

                    if (!settingsUpdated) {
                        /* #swagger.responses[304] = { 
                       description: 'No encontrado' 
                        } */
                        return res.status(304).send({
                            status: 'error',
                            message: 'No modificado',
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
                return res.status(304).send({
                    status: 'error',
                    message: 'Tipo de archivo no es imagen. El archivo ha sido borrado!!',
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
            return (res.status(403).send({
                status: "error"
            }));
        }

        var path_file = './uploads/logos/' + file;

        fs.stat(path_file, (err) => {

            if (err) {
            /* #swagger.responses[404] = { 
               description: 'No encontrado' 
            } */
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
                    messsage: "Al intentar eliminar un registro",
                    error: err.message
                }));

            } else {
                if (!deletedSettings) {
                    /* #swagger.responses[204] = { 
                    description: 'No eliminado' 
                    } */
                    return (res.status(204).send({
                        status: "error",
                        message: "No fue posible eliminar el registro",
                    }));
                }
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GeneralSetting" },
               description: '<b>Registro eliminado</b>' 
                } */
                return (res.status(200).send({
                    status: "ok",
                    deletedSettings: deletedSettings
                }));
            }

        });
    }


}

module.exports = generalsettingsController;