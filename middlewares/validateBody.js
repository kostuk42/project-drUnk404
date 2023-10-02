const {HttpError} = require('../helpers');
const validateBody = (schema) => {
    const func = async (req, res, next) => {
        if(!req.body || Object.keys(req.body).length === 0) {
            if( req.method === 'PATCH') {
                next(HttpError(400, 'missing field favorite'));
            } else {
                next(HttpError(400, 'missing fields'));
            }
           return
        }
        const { error } = await schema.validate(req.body);
        if (error) {
            next(HttpError(400, error.details.map(el => el.message).join(', ')));
        } else {
            next();
        }
    }
    return func;
}

module.exports = validateBody;
