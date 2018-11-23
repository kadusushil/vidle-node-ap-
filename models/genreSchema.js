const mongoose = require('mongoose');
const Joi = require('joi');
const genre = {};

genre.genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    }
});

genre.Genre = mongoose.model('Genre', genre.genreSchema);

genre.validateGenre = function (genre) {
    const schema = {
      name: Joi.string().min(3).required()
    };
  
    return Joi.validate(genre, schema);
}

module.exports = genre;
