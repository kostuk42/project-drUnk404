const {Schema, model} = require('mongoose');
const {handleMongooseError} = require("../helpers");

const Joi = require('joi');

const addSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'missing required name field'
    }),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
}).options({abortEarly : false})

const updateStatusSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
        'any.required': 'missing field favorite'
    }),
}).options({abortEarly : false})

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact']
    },

    email: {
        type: String
    },

    phone: {
        type: String
    },
    favorite: {
        type: Boolean,
        default: false
    }
},
    // {versionKey: false, timestamps: true}
);

const schemas = {
    addSchema,
    updateStatusSchema
}

contactSchema.post('save', handleMongooseError)

const Contact = model('contact', contactSchema);

module.exports = {
    Contact,
    schemas
};
