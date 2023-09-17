const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
    info: {
        title: 'ChildMotivator API',
        version: '1.0.0',
        description: 'API documentation',
    },
    basePath: '/',
};

const options = {
    swaggerDefinition,
    apis: ['./app.js', './*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
