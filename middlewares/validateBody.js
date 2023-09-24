const {HttpError} = require('../helpers');
const validateBody = (schema) => {
    const func = async (req, res, next) => {
        const { error } = await schema.validate(req.body);
        if (error) {
            console.log('error!!!');
            console.log(error);
            next(HttpError(400, error.details.map(el => el.message).join(', ')));
        } else {
            next();
        }
    }
    return func;
}

module.exports = validateBody;
