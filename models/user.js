const {Schema, model} = require('mongoose');
const {handleMongooseError} = require("../helpers");

const Joi = require('joi');

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema({
    // name: {
    //     type: String,
    //     required: [true, 'Set name for user']
    // },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: [true, 'Set email for user']
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, 'Set password for user']
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null
    },
    avatarURL: {
        type: String,
        default: null
    },
}, {
    versionKey: false,
    // timestamps: true
})

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

const registerJoiSchema = Joi.object({
    // name: Joi.string().required().messages({
    //     'any.required': 'missing required name field'
    // }),
    email: Joi.string().required().messages({
        'any.required': 'missing required email field'
    }).pattern(emailRegexp).messages(
        {
            'string.pattern.base': 'invalid email format'
        }
    ),

    password: Joi.string().required().messages({
        'any.required': 'missing required password field'
    }).min(6).messages({
        'string.min': 'password must be at least 6 characters long'
    }),

    subscription: Joi.string().valid('starter', 'pro', 'business').default('starter'),
    token: Joi.string().default(null)
}).options({abortEarly : false});

const loginJoiSchema = Joi.object({
    email: Joi.string().required().messages({
        'any.required': 'missing required email field'
    }).pattern(emailRegexp).messages(
        {
            'string.pattern.base': 'invalid email format'
        }
    ),

    password: Joi.string().required().messages({
        'any.required': 'missing required password field'
    }).min(6).messages({
        'string.min': 'password must be at least 6 characters long'
    }),
}).options({abortEarly : false});


const schemas = {
    registerJoiSchema,
    loginJoiSchema
}

module.exports = {
    User,
    schemas
}
