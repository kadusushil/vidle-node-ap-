const mongoose = require('mongoose');
const router = require('express').Router();
const Joi = require('joi');
const {Register, validateRegister} = require('./../models/register');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (req, res) => {
    // validate the data we received
    const {error} = validate(req);
    if (error) return res.status(400).send(error);

    // check if the user exists in the system
    const user = await Register.findOne({email: req.body.email});
    if (!user) return res.status(400).send('A Invalid email or password');

    // check for password now
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).send('B Invalid email or password');

    // const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'));
    const token = user.generateAuthToken();

    return res.send(token);
});

const loginSchema = {
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(6).required()
}

function validate(req) {
    return Joi.validate(req.body, loginSchema);
}

module.exports = router;