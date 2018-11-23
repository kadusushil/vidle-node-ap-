const mongoose = require('mongoose');
const {genreSchema} = require('./genreSchema');
const Joi = require('joi');

const movie = {};

movie.movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
});

movie.Movie = mongoose.model('Movie', movie.movieSchema);

movie.movieValidate = {
    title: Joi.string().required().min(2),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number().required().positive(),
    genreId: Joi.string().required()
};

movie.validateMovie = function (movieData) {
    return Joi.validate(movieData, movie.movieValidate);
}

module.exports = movie;