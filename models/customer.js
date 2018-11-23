const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    city: {
        type: String,
        required: true,
        minlength: 3
    }
});

const Customer = mongoose.model('Customer', customerSchema);

const customerJoiSchema = {
    name: Joi.string().min(3).required(),
    city: Joi.string().min(3).required()
}

function validate(customer) {
    return Joi.validate(customer, customerJoiSchema);
}

module.exports.Customer = Customer;
module.exports.validate = validate;
module.exports.customerSchema = customerSchema;
