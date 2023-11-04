const {Schema, model, Types} = require('mongoose');
const { handleMongooseError } = require("../helpers");

const categoriesEnum = require('../data/categories.json');
const glassesEnum = require('../data/glasses.json');
const Joi = require("joi");
const alcoholicEnum = ["Non alcoholic", "Alcoholic"]

const ingredientSchema = new Schema({
    title: String,
    measure: String,
    ingredientId: {
        type: Types.ObjectId,
        ref: 'Ingredient',
    },
    _id: false
});

const ingredientJoiSchema = Joi.object({
    title: Joi.string().required(),
    measure: Joi.string().required(),
    ingredientId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

const addOwnDrinkJoiSchema = Joi.object({
    drink: Joi.string().required().label('Drink Name').trim(),
    category: Joi.string().valid(...categoriesEnum).required().label('Category'),
    alcoholic: Joi.string().valid(...alcoholicEnum).required().label('Alcoholic Type'),
    glass: Joi.string().valid(...glassesEnum).required().label('Glass Type'),
    description: Joi.string().required().label('Short Description').trim(),
    instructions: Joi.string().required().label('Instructions').trim(),
    drinkThumb: Joi.string().default(null).label('Drink Thumbnail'),
    ingredients: Joi.array().items(ingredientJoiSchema).min(1).required()
}).messages({
    'string.base': 'The {#label} field should be a string.',
    'string.empty': 'The {#label} field cannot be empty.',
    'any.required': 'The {#label} field is required.',
    'string.valid': 'The value of {#label} field is not valid.',
    'string.regex.base': 'The {#label} field has an invalid format.',
    'array.min': 'At least one ingredient is required.',
});

const recipeSchema = new Schema({
    drink: {
        type: String,
        required: [true, 'Set name for drink'],
        unique: true,
    },
    category: {
        type: String,
        required: [true, 'Set category for drink'],
        enum: categoriesEnum,
    },
    alcoholic: {
        type: String,
        required: [true, 'Set type for drink'],
        enum: alcoholicEnum,
    },
    glass: {
        type: String,
        required: [true, 'Set glass for drink'],
        enum: glassesEnum,
    },
    description: {
        type: String,
        required: [true, 'Set the description for drink'],
    },
    instructions: {
        type: String,
        required: [true, 'Set the instructions for drink'],
    },
    drinkThumb: {
        type: String,
        default: "https://m.media-amazon.com/images/I/519EfrzZi9L._AC_UF894,1000_QL80_.jpg"
    },
    ingredients: {
        type: [ingredientSchema],
        required: [true, 'Recipe must have ingredients'],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    favorite: {
        type: [Schema.Types.ObjectId],
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: null
    }
}, {
    versionKey: false,
})

recipeSchema.post('save', handleMongooseError);

const Recipe = model('recipe', recipeSchema);

module.exports = {
    Recipe,
    addOwnDrinkJoiSchema
}
