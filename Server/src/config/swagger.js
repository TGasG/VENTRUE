const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const listApi = fs.readdirSync(path.resolve(__dirname, '..', 'api'));
const pathApi = listApi.map((d) => path.resolve(__dirname, '..', 'api', d));

const options = {
    swaggerDefinition: {
        openapi: '3.0.3',
        info: {
            title: 'ventrue-api-documentation',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
    },
    apis: [...pathApi],
};

module.exports = swaggerJsdoc(options);
