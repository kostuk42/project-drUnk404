const {Schema, model} = require('mongoose');
const {handleMongooseError} = require("../helpers");

const Joi = require('joi');

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Set name for user']
    },
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
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: null
    },
    avatarURL: {
        type: String,
        default: null
    },
    verify: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required']
    }
}, {
    versionKey: false,
    // timestamps: true
})

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

const registerJoiSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'missing required name field'
    }),
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

const emailJoiSchema = Joi.object({
    email: Joi.string()
        .pattern(emailRegexp).messages({
            'string.pattern.base': 'invalid email format'
        })
        .required().messages({
        'any.required': 'missing required email field'
    })
});

const subscribeJoiSchema = Joi.object({
    email: Joi.string()
        .pattern(emailRegexp).messages({
            'string.pattern.base': 'invalid email format'
        })
        .required().messages({
        'any.required': 'missing required email field'
    })
});


const schemas = {
    registerJoiSchema,
    loginJoiSchema,
    emailJoiSchema,
    subscribeJoiSchema
}

module.exports = {
    User,
    schemas
}
