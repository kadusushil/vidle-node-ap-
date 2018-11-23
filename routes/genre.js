const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('./../models/genreSchema');
const auth = require('./../middleware/auth');
const admin = require('./../middleware/admin');
const asyncHandler = require('./../middleware/async');
const validateObjectId = require('./../middleware/validateObjectId');
const validator = require('./../middleware/validator');


// router.get('/', auth, async (req, res, next) => {
router.get('/', async (req, res, next) => {
    // throw new Error('Could not get genre');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});
  
router.post('/', [auth, validator(validateGenre)], async (req, res) => {
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.send(genre);
});
  
router.put('/:id', [auth, validator(validateGenre)], async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;