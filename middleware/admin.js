const mongoose = require('mongoose');
const {Register} = require('./../models/register'); 

module.exports = function(req, res, next) {
    
    if (!req.user.isAdmin) return res.status(403).send('Access Denied');

    next();
}