const mongoose = require('mongoose');
const router = require('express').Router();
const {Rental, validateRental} = require('./../models/rental');
const {Customer} = require('./../models/customer');
const {Movie} = require('./../models/moviesSchema');
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    return res.send(await Rental.find());
});

router.post('/', async (req, res) => {   
    const {error, result} = validateRental(req.body);    
    if (error) return res.status(400).send(error);    
    // check if customer exists
    try {

    // if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
    //     // Yes, it's a valid ObjectId, proceed with `findById` call.
    //     return res.status(400).send('Not a valid customer id');
    // }    

    const customer = await Customer.findById(req.body.customerId);
    
    if (!customer) return res.status(400).send('Id with given customer not found');

    // if (!mongoose.Types.ObjectId.isValid(req.body.movieId)) {
    //     // Yes, it's a valid ObjectId, proceed with `findById` call.
    //     return res.status(400).send('Not a valid movie id');
    // }   
    // check if movie exists
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Id with given movie not found');

    // before renting this out, check if movie stock exists
    if (movie.numberInStock-1 < 0) {
        // can't rent, we are out of stock
        return res.status(405).send('Movie out of stock');
    }

    const rental = new Rental({
        customer: {
            name: customer.name,
            city: customer.city
        },
        movie: {
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
            genre: {
                name: movie.genre.name
            }
        }
    });

    new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id},
        {$inc: {
            numberInStock: -1
        }})
        .run();
    
    return res.send(rental);
} catch(err) {
    console.log('Error: ', err);
    return res.status(500).send('Something went wrong');
}
});

module.exports = router;