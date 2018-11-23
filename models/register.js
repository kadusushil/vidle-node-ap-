const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');

function toLower(v) {
    return v.toLowerCase();
}

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        set: toLower
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 250,
        required: true
    },
    isAdmin: Boolean
});

registerSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const Register = mongoose.model('Register', registerSchema);

const registerValidateSchema = {
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(3).max(50).email(),
    password: Joi.string().required().min(6).max(250)
};

async function validateRegister(register) {

    const complexityOptions = {
        min: 5,
        max: 250,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
      }
    
    try {
        await Joi.validate(register.password, new PasswordComplexity(complexityOptions));
    } catch(e) {
        return {'error': e};
    }
    return Joi.validate(register, registerValidateSchema);
}

module.exports.Register = Register;
module.exports.validateRegister = validateRegister;