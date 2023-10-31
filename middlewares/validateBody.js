const {HttpError} = require('../helpers');
const validateBody = (schema) => {
    const func = async (req, res, next) => {
        const reqsWithoutBody = ['signout', 'remove', 'verify']
        if(!req.body || Object.keys(req.body).length === 0 && !reqsWithoutBody.includes(req.url)) {
            next(HttpError(400, 'missing fields'));
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
