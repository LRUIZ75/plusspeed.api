const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        version: "1.0.0",
        title: "Velozz API",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    host: "localhost:3900",
    basePath: "/api",
    schemes: ['http', 'https'],
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
            franchiseName: "Velozz",
            franchiseLogo: "",
            clientInvoicesDueDays: 7,
            TIN: "8751357",
            address: "Managua, NI",
            invoicesFooter: "Life made easy",
            invoicesCurrencyName: "USD",
            payInstructions: "Pay instructions here"
        }

    }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.js','./routes/app.routes.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index')           // Your project's root file
})