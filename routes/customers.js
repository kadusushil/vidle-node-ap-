const mongoose = require('mongoose');
const routes = require('express').Router();
const {Customer, validate} = require('./../models/customer');

routes.get('/', async (req, res) => {
    res.send(Customer.find().sort({name:1}));
});

routes.post('/', async (req, res) => {
    const {error, success} = validate(req.body);
    
    if (error) return res.status(400).send(error);

    const customer = new Customer({
        name: req.body.name,
        city: req.body.city
    });

    const result = await customer.save();
    res.send(result);
});

module.exports = routes;