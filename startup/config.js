const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        console.error('FATAL Error: Please define jwtPrivateKey');
        process.exit(1);
    }
}