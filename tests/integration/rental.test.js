const mongoose = require('mongoose');
const {Rental} = require('./../../models/rental');
const request = require('supertest');
const {Register} = require('./../../models/register');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    let payload = {customerId, movieId};

    beforeEach(async () => {
        server = require('./../../index');
        token = await new Register().generateAuthToken();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'abcdef',
                city: 'Nagpur'
            },
            movie: {
                _id: movieId,
                title: 'This is a title',
                dailyRentalRate: 20,
                genre: {
                    name: 'xyzze'
                }
            }
        });

        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
    });

    const exec = function() {
                return request(server)
                    .post('/api/returns')
                    .set('x-auth-token', token)
                    .send(payload)
                }

    it('should return 401 if client is not logged in', async () => {
        token = ''

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if not customerId is not passed', async () => {
        payload = {movieId};

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if not movieId is not passed', async () => {
        payload = {customerId};

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if not customerId or movieId is not valid objectId', async () => {
        payload = {customerId: 100, movieId: 200};

        const res = await exec();

        expect(res.status).toBe(400);
    });

    // it('should return 400 if invalid customerId or movieId is passed', async () => {
    //     payload = {customerId: mongoose.Types.ObjectId(), 
    //                 movieId: mongoose.Types.ObjectId()};

    //     const res = await exec();

    //     expect(res.status).toBe(400);
    // });

    it('should return 404 if not rental is found for this customer/movie', async () => {
        
        const res = await exec();

        expect(res.status).toBe(400);
    });
});