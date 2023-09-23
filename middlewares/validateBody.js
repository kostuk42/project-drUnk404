const {HttpError} = require('../helpers');
const validateBody = (schema) => {
    const func = async (req, res, next) => {
        if(!req.body || !Object.keys(req.body).length) {
            next(HttpError(400, `Missing fields`));
        }
        const { error } = await schema.validate(req.body);
        if (error) {
            next(HttpError(400, `Missing required ${error.details.map(el => el.path).join(', ')} fields`));
        } else {
            next();
        }
    }
    return func;
}

module.exports = validateBody;
