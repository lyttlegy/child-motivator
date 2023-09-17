const express = require('express');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const mssql = require('mssql');

const swaggerSpec = require('./swagger'); 
const tasksRouter = require('./tasks'); 
const personsRouter = require('./persons');
const pointsRouter = require('./points');

const app = express();
const port = process.env.PORT || 3000;

const pool = require('./db');

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/persons', personsRouter);

app.use('/api/tasks', tasksRouter);

app.use('/api/points', pointsRouter);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});