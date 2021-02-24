'use strict'

const os = require('os');
const personsModel = require('../models/persons.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { findOneAndDelete } = require('../models/persons.model');


var personsController = {


    getPersons: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'LISTAR PERSONAS.'

        var personId = req.params.id;

        var query = { '_id': { $eq: personId } };

        if (!personId || personId === undefined) query = {};
        else query = { '_id': { $eq: personId } };

        console.log(query);

        personsModel.find(query, (err, persons) => {


            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                })
                );
            }

            if (!persons || persons.length == 0) {
 
                return (res.status(404).send({
                    status: "error",
                    message: "Registro(s) no encontrado(s)",
                    links: [{ "Agregar registro => curl -X POST ": global.baseURL + "/api/persons" }]
                }

                ));
            } else {
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Person" },
               description: '<b>People</b>' 
                } */

                return (res.status(200).send({
                    status: "ok",
                    people:persons
                }));
            }
        });
    },

    addPerson: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'AGREGAR NUEVA PERSONA.'
        // #swagger.schema = { $ref: "#/definitions/Person" }
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

        //var parsedJSON = JSON.parse(JSON.stringify(data));
        // console.log(data);
        // console.log(JSON.stringify(data));
        // console.log(parsedJSON);
        // console.log(new personsModel(data));

        var newPerson = new personsModel(data);



        //INTENTAR GUARDAR EL NUEVO OBJETO
        newPerson.save((err, storedPerson) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));

            } else {
                if (!storedPerson) {
                    return (res.status(500).send({
                        status: "error",
                        message: "Error al intentar guardar un nuevo registro"
                    }));
                }
                /* #swagger.responses[201] = { 
               schema: { $ref: "#/definitions/Person" },
               description: '<b>Creado</b>' 
                } */
                return (res.status(201).send({
                    status: "ok",
                    created: storedPerson
                }));
            }

        });
    },

    editPerson: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'ACTULIZAR DATOS DE PERSONA.'

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
        var personId = req.params.id;
        var data = req.body;

        if (!personId || personId == undefined) {
            return (res.status(400).send({
                status: "error",
                message: "falta parámetro requerido ID"
            }));
        }
        if (!data || data == undefined) {
            return (res.status(400).send({
                status: "error",
                message: "falta parámetro requerido data JSON"
            }));
        }

        var query = { '_id': { $eq: personId } };
        var command = { $set: data };

        personsModel.findOneAndUpdate(query, command, { new: true }, (err, modifiedPerson) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));
            }

            if (!modifiedPerson) {

                return (res.status(404).send({
                    status: "error",
                    message: "No se encontró el registro a modificar"
                }));
            }
            /* #swagger.responses[200] = { 
           schema: { $ref: "#/definitions/Person" },
           description: '<b>Actualizado</b>' 
            } */
            return (res.status(200).send({
                status: "ok",
                updated: modifiedPerson
            }));

        });

    },

    deletePerson: (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'ELIMINAR DATOS DE PERSONA.'

        /* #swagger.parameters['id'] = {
           description: 'Id del registro en la coleccion' ,
           type: 'string',
        required: true} 
        */

        var personId = req.params.id;
        if (!personId || personId == undefined) {
            return (res.status(400).send({
                status: "error",
                message: "falta parámetro requerido ID"
            }));
        }

        var query = { '_id': { $eq: personId } };

        personsModel.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));
            }

            if (!deletedObject) {

                return (res.status(404).send({
                    status: "error",
                    message: "No se encontró el registro a eliminar"
                }));
            }

            /* #swagger.responses[200] = { 
           schema: { $ref: "#/definitions/Person" },
           description: '<b>Borrado</b>' 
            } */
            return (res.status(200).send({
                status: "ok",
                deleted: deletedObject
            }));

        });
    },

    setPicture: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'ACTUALIZAR FOTO DE UNA PERSONA'

        /* #swagger.parameters['id'] = {
           description: 'Id del registro en la coleccion' ,
           type: 'string',
           required: true } 
        */
        /*
            #swagger.parameters['picture'] = {
            in: "formData",
            name: "picture",
            type: "file",
            required: true
          }
        */


        //description: 'Archivo grafico: PNG JPEG GIF' ,

        //recojer fichero de petición
        var file_name = 'Imagen no proporcionada...';
        var personId = req.params.id;

        // console.log(req.files);

        if (!req.files.picture) {
            return res.status(400).send({
                status: 'error',
                message: 'No hay parametro: logo',
                file_name
            });
        }
        if (!personId) {

            return res.status(400).send({
                status: 'error',
                message: 'No hay parámetro: Id'
            });
        }

        //conseguir nombre y extensión del archivo
        var file_path = req.files.picture.path;

        var file_name = path.basename(file_path);

        var file_ext = path.extname(file_name);


        console.log(file_ext);

        switch (file_ext) {
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                //Archivo aceptable


                var query = { '_id': { $eq: personId } };
                var command = { $set: { 'picture': file_name } };


                personsModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {

                    if (err) {

                        fs.unlinkSync(file_path);

                        return res.status(500).send({
                            status: 'error',
                            error: err
                        });
                    }

                    if (!updatedObject) {

                        fs.unlinkSync(file_path);

                        return res.status(404).send({
                            status: 'error',
                            message: 'No se pudo encontrar el registro'
                        });
                    }

                    /* #swagger.responses[200] = { 
                   description: '<b>Actualizado</b>' 
                    } */
                    return res.status(200).send({
                        status: 'ok',
                        updated: updatedObject
                    });
                });
                break;

            default:
                //Archivo no aceptado

                //Borrar el archivo

                fs.unlinkSync(file_path);

                return res.status(400).send({
                    status: 'error',
                    message: 'Tipo de archivo no es imagen',
                    file_name
                }
                );
                break;
        };
    },

    getPicture: (req, res) => {

       // #swagger.tags = ['User']
        // #swagger.description = 'Obtener Foto'

        /* #swagger.parameters['filename'] = {
           description: 'Nombre de archivo imagen' ,
           type: 'string',
            required: true} 
        */

       var file = req.params.filename;
       if (validator.isEmpty(file)) {
           return (res.status(400).send({
               status: "error",
               message: "falta el nombre del archivo"
           }));
       }

       var path_file = './uploads/pictures/' + file;

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


    }

}

module.exports = personsController;