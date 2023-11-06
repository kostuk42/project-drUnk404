const {HttpError} = require('../helpers');
const validateBody = (schema) => {
    const func = async (req, res, next) => {
        const reqsWithoutBody = ['signout', 'remove', 'verify']
        if(!req.body || Object.keys(req.body).length === 0 && !reqsWithoutBody.includes(req.url)) {
            next(HttpError(400, 'missing fields'));
           return
        }

        if(req.body.ingredients && typeof req.body.ingredients === 'string') {
            req.body.ingredients = JSON.parse(req.body.ingredients);
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
