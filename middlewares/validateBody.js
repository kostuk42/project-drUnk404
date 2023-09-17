const {HttpError} = require('../helpers');
const validateBody = (schema) => {
    const func = async (req, res, next) => {
        const { error } = await schema.validate(req.body);
        if (error) {
            next(HttpError(400, error.message));
        } else {
            next();
        }
    }
    return func;
}

module.exports = validateBody;
