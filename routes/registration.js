const router = require('express').Router();
const mongoose = require('mongoose');
const {Register, validateRegister} = require('./../models/register');
const lodash = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('./../middleware/auth');

router.get('/me', auth, async (req, res) => {
    const register = await Register.findById(req.user._id)
                        .select('-password');

    res.send(register);
});

router.post('/', async (req, res) => {
    const {error, success} = await validateRegister(req.body);
    if (error) return res.status(400).send(error);

    let register = await Register.findOne({email: req.body.email});    
    if (register) return res.status(400).send('User already registered');
    
    register = new Register(lodash.pick(req.body,
                ['name', 'email', 'password']));

    try {
        const salt = await bcrypt.genSalt(10);
        register.password = await bcrypt.hash(register.password, salt);
        await register.save();

        const token = register.generateAuthToken();
        res.header('x-auth-token', token).send(lodash.pick(register, ['_id', 'name', 'email']));
    } catch(e) {
        res.send(e);
    }
});

module.exports = router;