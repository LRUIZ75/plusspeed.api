const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        version: "1.0.0",
        title: "+Speed API",
        description: "+Speed API Restful - <b>Generado con Swagger</b>"
    },
    host: "",
    basePath: "/api",
    schemes: ['https', 'http'],
    consumes: ['application/json', 'form-data'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
            flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
    },
    definitions: {
        NoSchema: {},
        GeneralSetting: {
            franchiseName: "+Speed",
            franchiseLogo: "",
            clientInvoicesDueDays: 7,
            TIN: "8751-23357",
            address: "Managua, NI",
            invoicesFooter: " ************* FOOTER ************* ",
            invoicesCurrencyName: "USD",
            payInstructions: "Pay instructions here"
        },
        Person: {
            names: "Nombres",
            surnames: "Apellidos",
            idNumber: "2155654",
            genre: "Hombre",
            birthday: "",
            picture: ""
        },
        Users: {
            userName: "lruiz75",
            password: "hashedvalue",
            personId: "ObjectId",
            registeredEmail: "lruiz75@gmail.com",
            isVerifiedEmail: true,
            ssoProviderId: "mongoose.ObjectId",
            registrationDate: "20/02/2021",
            pinOTP: "Very large string",
            pinOTPExpiration: "",
            profilesNames: "comprador",
            clientId: "mongoose.ObjectId",
            bearerToken: "sadf2s2e23rdfasdfasd",
            isLoggedOn: false,
            lastLogOn: "",
            isActive: true
        },
        Clients: {
            clientName: "Nombre del Cliente",
            clientTypeId: "2",
            description: "Descripcion",
            logo: "archivo de imagen",
            registerDate: "20/02/2021",
            bussinessManageId: "1234213l412321l1234l235",
            bussinessPhone: "77458877",
            bussinessMobile: "4654687",
            businessEmail: "someone@somewhere.com",
            taxpayerIdentNumber: "2415-2342234-2",
            hqLocation: "x=122.2,y=234.2",
            hqAddress: "Dirección del establecimiento principal",
            currentSettingsId: "ObjectId",
            clientAccountingId: "ObjectId",
            isActive: true
        },
        Drivers:{
            userId: "mongoose.SchemaTypes.ObjectId",
            mobile: "String",
            homeAddress: "String",
            homeLocation: "Map",
            vehicleType: "String", //requiere enumeracion
            plateNumber: "String",
            vehiclePicture: "String",
            platePicture: "String",
            vehicleDocumentsPictures: ["String"],
            driversLicenseExpirationDate: "Date",
            vehicleInsuranceExpirationDate: "Date",
            vehicleLicenseExpirationDate: "Date",
            policeRecordPictures: ["String"],
            policeRecordExpirationDate: "Date",
            currentPosition: "Map", //RouteNode Object
            aprovalDate: "Date",
            aprovedByUserId: "Number",
            isActive: "Boolean",
            isAvailable: "Boolean"
        }
    }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.js', './routes/app.routes.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index')           // Your project's root file
})