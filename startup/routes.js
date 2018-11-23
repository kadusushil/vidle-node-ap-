const express = require('express');
const moviesRouter = require('./../routes/movies');
const genreRouter = require('./../routes/genre');
const customerRouter = require('./../routes/customers');
const rentalRouter = require('./../routes/rentals');
const registerRouter = require('./../routes/registration');
const authRouter = require('./../routes/auth');
const errorHandler = require('./../middleware/error');
const validateObjectId = require('./../middleware/validateObjectId');
const returnRoutes = require('./../routes/returns');


module.exports = function(app) {
    // set for json payload
    app.use(express.json());
    app.use('/api/movies', moviesRouter);
    app.use('/api/genre', genreRouter);
    app.use('/api/customer', customerRouter);
    app.use('/api/rental', rentalRouter);
    app.use('/api/register', registerRouter);
    app.use('/api/login', authRouter);
    app.use('/api/returns', returnRoutes);

    // register error handler
    app.use(errorHandler);
}