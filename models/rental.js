const mongoose = require('mongoose');
const {customerSchema} = require('./customer');
const {movieSchema} = require('./moviesSchema');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true,
        ref: 'Customer'
    },
    movie: {
        type: movieSchema,
        required: true,
        ref: 'Movie'
    }
});

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer.customerId': customerId,
        'movie.movieId': movieId
    });
}

const Rental = mongoose.model('Rental', rentalSchema);

const rentalJoiSchema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
}

function validateRental(rental) {
    return Joi.validate(rental, rentalJoiSchema);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
