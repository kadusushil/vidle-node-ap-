module.exports = (validator) => {
    return (req, res, next) => {

        const {error, success} =  validator(req.body);
        if (error) res.status(400).send('error');

        next();
    };
};