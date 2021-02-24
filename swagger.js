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
    consumes: ['application/json','form-data'],
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
        NoSchema :{},
        GeneralSetting : {
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
        }

    }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.js','./routes/app.routes.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index')           // Your project's root file
})