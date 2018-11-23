const {Register} = require('./../../../models/register');
const auth = require('./../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware test', () => {

    it('should populate req.user with a payload of valid JWT', () =>{
        // generate token
        const userPayload = {_id:mongoose.Types.ObjectId().toHexString(),
                            isAdmin: true};
        const token = new Register(userPayload).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();

        auth(req, res, next);
                
        expect(req.user).toMatchObject(userPayload);
    });
});