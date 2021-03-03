'use strict'

const os = require('os');
const generalsettingsModel = require('../models/generalsettings.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
var multipart = require('connect-multiparty');
var md_uploadsettings = multipart({ uploadDir: './uploads/logos' });

/**
 * @swagger
 * tags:
 *   name: GeneralSettings
 *   description: Settings
 */

var generalsettingsController = {

    /**
     * @openapi
     * /api/settings/{id}:
     *   get:
     *     tags: 
     *       - GeneralSettings
     *     description: Get general settings by Id
     *     security:
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: Object Id
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSettings"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    /**
     * @openapi
     * /api/settings:
     *   get:
     *     tags: 
     *       - GeneralSettings
     *     description: Get list of general settings
     *     security:
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: "#/components/schemas/GeneralSettings"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    getSettings: (req, res) => {

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

                return (res.status(200).send({
                    status: "ok",
                    generalsettings: settings
                }));
            }
        });
    },

    /**
     * @openapi
     * /api/settings:
     *   post:
     *     tags: 
     *       - GeneralSettings
     *     description: Create general settings
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: header
     *         name: Authorization
     *       - in: body
     *         required: true
     *         schema:
     *           $ref: "#/components/schemas/GeneralSettings"
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSettings"
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    addSettings: (req, res) => {
        var data = req.body;
 
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

                return (res.status(201).send({
                    status: "ok",
                    created: storedSettings
                }));
            }

        });
    },
    
    /**
     * @openapi
     * /api/settings/{id}:
     *   put:
     *     tags: 
     *       - GeneralSettings
     *     description: Update general settings
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: header
     *         name: Authorization
     *       - in: path
     *         name: id
     *         description: "Object Id"
     *         type: string
     *         required: true
     *       - in: body
     *         required: true
     *         schema:
     *           $ref: "#/components/schemas/GeneralSettings"
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSettings"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    editSettings: (req, res) => {

        var data = req.body;

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
/*         console.log(query);
        console.log(command); */



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

                return (res.status(200).send({
                    status: "ok",
                    updated: storedSettings
                }));
            }

        });
    },

    
    /**
     * @openapi
     * /api/settings/logo/{id}:
     *   put:
     *     tags: 
     *       - GeneralSettings
     *     description: Upload general settings logo
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: header
     *         name: Authorization
     *       - in: path
     *         name: id
     *         description: "Object Id"
     *         type: string
     *         required: true
     *       - in: form-data
     *         name: logo
     *         required: true
     *         content:
     *           file:
     *             schema:
     *               type: string
     *               format: base64
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSettings"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    setLogo: (req, res) => {

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


    /**
     * @openapi
     * /api/settings/logo/{filename}:
     *   get:
     *     tags: 
     *       - GeneralSettings
     *     description: Get general settings logo by filename
     *     parameters:
     *       - in: path
     *         name: filename
     *         description: Image filename
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           image/png:
     *             type: image
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    getLogo: (req, res) => {

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

            return res.status(200).sendFile(path.resolve(path_file));

        });

    },

    /**
     * @openapi
     * /api/settings/{id}:
     *   delete:
     *     tags: 
     *       - GeneralSettings
     *     description: Delete General Settings by id
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: header
     *         name: Authorization
     *       - in: path
     *         name: id
     *         description: "Object Id"
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSettings"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    deleteSettings: (req, res) => {

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

                return (res.status(200).send({
                    status: "ok",
                    deleted: deletedSettings
                }));
            }

        });
    }


}

module.exports = generalsettingsController;