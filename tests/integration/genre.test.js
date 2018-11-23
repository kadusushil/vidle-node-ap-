const request = require('supertest');
let server;
const {Genre} = require('./../../models/genreSchema');
const mongoose = require('mongoose');
const {Register} = require('./../../models/register');
let token;

describe('/api/genre', () => {

    beforeEach(async () => {
        server = require('./../../index');
        token = await new Register().generateAuthToken();
    });

    afterEach(async () => {
        await server.close(); 
        await Genre.remove({});
    });

    describe('/GET /', () => {        
        it('should return all genre', async () => {
            // populate db
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);

            const res = await request(server).get('/api/genre');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name == 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name == 'genre2')).toBeTruthy();
        });
    });

    describe('/GET /:id', () => {
        
        it('should return genre if valid genre id is passed', async () => {
            let genre = new Genre({name: 'genre1'});
            await genre.save();
    
            const path = `/api/genre/${genre._id}`;
            console.log('path: ', path);
            
            // make a request
            const res = await request(server).get(path);
            
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({name:genre.name});
        });
        
        it('should return 404 if the invalid id is passed', async () => {
            // make a request
            const res = await request(server).get('/api/genre/1');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let payload;
        beforeEach(() => {
            payload = {name: 'genre1'};
        });

        const exec = async function() {
            return await request(server)
                            .post('/api/genre')
                            .set('x-auth-token', token)
                            .send(payload);
        }

        it('should 401 if the user is not logged in', async () => {
            token = '';
            const res = await exec();
            
            expect(res.status).toBe(401);
        });

        it('should return 400 when genre is less than 4 chars', async () => {
            // generate token            
            payload = {name: 'a'};
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return genre if valid genre is passed', async () => {
            payload = {name: 'Comedy'};
            const res = await exec();
            
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(payload);

            // check if it is saved in DB
            const genre = await Genre.findOne(payload);
            expect(genre).not.toBeNull();
        });
    });

    describe('DELETE /', () => {

        let genre;
        beforeEach(async () => {
            const payload = {isAdmin: true};
            token = new Register(payload).generateAuthToken();
            genre = new Genre({name: 'genre1'});
            await genre.save();
        });

        const exec = function() {
            return request(server)
                    .delete('/api/genre/' + genre._id)
                    .set('x-auth-token', token)
                    .send();
        }

        it('should be able to delete data if valid id is passed', async () => {
            // create new genre
            const res = await exec();

            // check status
            expect(res.status).toBe(200);

            // check genre status
            genre = await Genre.findById(genre._id);
            expect(genre).toBeNull();
        });

        it('should return 401 if no token is passed', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not admin', async () => {
            const payload = {isAdmin: false};
            token = new Register(payload).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });
    });

    describe('PUT /', () => {
        
        let genre;
        let genreId;
        let payload = {name: 'genre2'};
        beforeEach(async () => {
            const payload = {isAdmin: false};
            token = new Register(payload).generateAuthToken();
            genre = new Genre({name: 'genre1'});
            await genre.save();
            genreId = genre._id;
        });

        const exec = function() {
            return request(server)
                    .put('/api/genre/' + genreId)
                    .set('x-auth-token', token)
                    .send(payload);
        }

        it('should return 401 if trying to modify a genre', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if valid id is not passed', async () => {
            genreId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should be able to update existing genre given valid id is passed', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(payload);
        });
    });
});