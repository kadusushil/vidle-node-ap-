const request = require('supertest');
let server;
const {Genre} = require('./../../models/genreSchema');
let token;
const {Register} = require('./../../models/register');

describe('AUTH middleware', () => {

    beforeEach(async () => {
        server = require('./../../index');
        token = await new Register().generateAuthToken();
    });

    afterEach(async () => {
        await server.close(); 
        await Genre.remove({});
    });

    const exec = async function() {
                    return await request(server)
                    .post('/api/genre')
                    .set('x-auth-token', token)
                    .send({name: 'genre1'});
                }
    
    it('should return 401 if not auth token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if the token is not valid', async () => {
        token = '123455';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if the token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});