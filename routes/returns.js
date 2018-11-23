const router = require('express').Router();
const auth = require('./../middleware/auth');
const {validateReturns} = require('./../models/return');
const {Customer} = require('./../models/customer');
const {Movie} = require('./../models/moviesSchema');
const {Rental} = require('./../models/rental');
const validator = require('./../middleware/validator');

// const validate = (validator) => {
//     return (req, res, next) => {

//         const {error, success} =  validator(req.body);
//         if (error) res.status(400).send('error');

//         next();
//     };
// };

router.post('/', [auth, validator(validateReturns)], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    
    // const customer = await Customer.findById(req.body.customerId);
    // if (!customer) res.status(400).send('Not a valid customer ID');

    // const movie = await Movie.findById(req.body.movieId);
    // if (!movie) res.status(400).send('Not a valid movie ID');

    if (!rental) return res.status(404).send('Rental not found');

    return res.status(200);
});

module.exports = router;