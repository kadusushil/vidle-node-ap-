require('express-async-errors');
const express = require('express');
const winston = require('winston');

const app = express();
require('./startup/routes')(app);
require('./startup/dbInit')();
require('./startup/config')();
require('./startup/prod')(app);

process.on('uncaughtException', (err) => {
    console.log('We got uncaught exception');
});

const server = app.listen(8000, () => console.log('Listening on port: 8000'));

module.exports = server;
