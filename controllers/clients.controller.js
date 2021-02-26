
/*
var clientsController = require('../controllers/clients.controller');

// CLIENTS
router.post('/clients', clientsController.addClients); //CREATE

//router.put('/clients/picture/:id', md_uploadpictures, clientsController.setPicture); //UPDATE
router.put('/clients/:id', clientsController.editClients); //UPDATE

router.get('/clients/:id?',clientsController.getClients); //RETRIEVE
router.get('/clients',clientsController.getClients); //RETRIEVE
//router.get('/clients/picture/:filename',clientsController.getPicture); //RETRIEVE

router.delete('/clients/:id',clientsController.deleteClients); //DELETE

*/

'use strict'

const os = require('os');
const clientsModel = require('../models/clients.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { findOneAndDelete } = require('../models/clients.model');




var clientsController = {


    getClients: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'LISTAR REGISTROS.'

        var id = req.params.id;

        var query = { '_id': { $eq: id } };

        if (!id || id === undefined) query = {};
        else query = { '_id': { $eq: id } };

        console.log(query);

        clientsModel.find(query, (err, objects) => {


            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                })
                );
            }

            if (!objects || objects.length == 0) {
 
                return (res.status(404).send({
                    status: "error",
                    message: "Registro(s) no encontrado(s)",
                    links: [{ "Agregar registro => curl -X POST ": global.baseURL + "/api/clients" }]
                }

                ));
            } else {
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Clients" },
               description: '<b>Lista de Objetos</b>' 
                } */

                return (res.status(200).send({
                    status: "ok",
                    objects: objects
                }));
            }
        });
    },

    addClients: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'CREAR UN REGISTRO.'
        // #swagger.schema = { $ref: "#/definitions/Clients" }
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
                messager: "Faltan parámetros de request en formato JSON"
            })
            );
        }

        //var parsedJSON = JSON.parse(JSON.stringify(data));
        // console.log(data);
        // console.log(JSON.stringify(data));
        // console.log(parsedJSON);
        // console.log(new personsModel(data));

        var newClients = new clientsModel(data);



        //INTENTAR GUARDAR EL NUEVO OBJETO
        newClients.save((err, storedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));

            } else {
                if (!storedObject) {
                    return (res.status(500).send({
                        status: "error",
                        message: "Error al intentar guardar un nuevo registro"
                    }));
                }
                /* #swagger.responses[201] = { 
               schema: { $ref: "#/definitions/Clients" },
               description: '<b>Creado</b>' 
                } */
                return (res.status(201).send({
                    status: "ok",
                    created: storedObject
                }));
            }

        });
    },

    editClients: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'ACTULIZAR DATOS.'

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
        var data = req.body;

        if (!id || id == undefined) {
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

        var query = { '_id': { $eq: id } };
        var command = { $set: data };

        clientsModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));
            }

            if (!updatedObject) {

                return (res.status(404).send({
                    status: "error",
                    message: "No se encontró el registro a modificar"
                }));
            }
            /* #swagger.responses[200] = { 
           schema: { $ref: "#/definitions/Clients" },
           description: '<b>Actualizado</b>' 
            } */
            return (res.status(200).send({
                status: "ok",
                updated: updatedObject
            }));

        });

    },

    deleteClients: (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'ELIMINAR DATOS.'

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
           schema: { $ref: "#/definitions/Clients" },
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
        // #swagger.description = 'SUBIR Y ACTUALIZAR IMAGEN'

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
        var id = req.params.id;

        // console.log(req.files);

        if (!req.files.picture) {
            return res.status(400).send({
                status: 'error',
                message: 'No hay parametro: logo',
                file_name
            });
        }
        if (!id) {

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


                var query = { '_id': { $eq: id } };
                var command = { $set: { 'logo': file_name } };


                clientsModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {

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
        // #swagger.description = 'RECUPERAR LA IMAGEN'

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


    }

}

module.exports = clientsController;