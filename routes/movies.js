const mongoose = require('mongoose');
const router = require('express').Router();
const {Movie, validateMovie} = require('../models/moviesSchema');
const {Genre, validateGenre} = require('../models/genreSchema');
const Joi = require('joi');

const titleValidate = {
    title: Joi.string().required().min(2)
}

const dailyRentalValidate = {
    dailyRentalRate: Joi.number().required().positive(),
}

const numberInStockValidate = {
    numberInStock: Joi.number()
}

// the route is /api/movies
router.get('/', async (req, res) => {
    const movies = await Movie.find()
    .sort({name: 1});
    res.send(movies);
});

router.post('/', async (req, res) => {

    const {error, value} = validateMovie(req.body);
    if (error) return res.status(400).send(error);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Id with given genre not found');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            name: genre.name
        },
        numberInStock: req.body.numberInStock | 0,
        dailyRentalRate: req.body.dailyRentalRate
    });

    const result = await movie.save();
    res.send(result);
});

router.put('/:movieId', async (req, res) => {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) return req.status(400).send('Movie with given id not found');

    if (req.body.title) {
        const {error, value} = Joi.validate(req.body, titleValidate);
        console.log('title: ', error, value);

        if (error) return res.status(400).send(result);
        movie.title = req.body.title;
    }

    if (req.body.dailyRentalRate) {
        const {error, value} = await Joi.validate(req.body, dailyRentalValidate);
        if (error) return res.status(400).send(result);
        movie.dailyRentalRate = req.body.dailyRentalRate;
    }

    if (req.body.numberInStock) {
        const {error, value} = Joi.validate(req.body, numberInStockValidate);
        console.log('numberInStock: ', error, value);
        
        if (!error) return res.status(400).send(result);
        movie.numberInStock = req.body.numberInStock;
    }

    if (req.body.genre.name) {
        movie.genre.name = req.body.genre.name;
    }

    const result = await movie.save();

    return res.send(result);
});


module.exports = router;