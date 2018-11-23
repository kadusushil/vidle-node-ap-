const jwt = require('jsonwebtoken');
const config = require('config');
const {Register} = require('./../../models/register');
const mongoose = require('mongoose');

describe('register', () => {
    it('should return a valid jwt token', () => {
     
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const user = new Register(payload);

        const token = user.generateAuthToken();
        
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});

// registerSchema.methods.generateAuthToken = function() {
//     const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
//     return token;
// }