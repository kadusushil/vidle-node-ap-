const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const returnValidateSchema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
};

function validateReturns(returnObj) {
    return Joi.validate(returnObj, returnValidateSchema);
}

module.exports.validateReturns = validateReturns;