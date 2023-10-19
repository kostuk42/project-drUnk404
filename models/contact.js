const {Schema, model} = require('mongoose');
const {handleMongooseError} = require("../helpers");

const Joi = require('joi');

const addSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'missing required name field'
    }),
    email: Joi.string().required().messages({
        'any.required': 'missing required email field'
    }),
    phone: Joi.string().required().messages({
        'any.required': 'missing required phone field'
    }),
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
        type: String,
        required: [true, 'Set email for contact']
    },

    phone: {
        type: String,
        required: [true, 'Set phone for contact']
    },
    favorite: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Set owner for contact']
    }
},
    {
        versionKey: false,
        // timestamps: true
    }
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