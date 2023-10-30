const {Schema, model, Types} = require('mongoose');
const { handleMongooseError } = require("../helpers");

const categoriesEnum = require('../data/categories.json');
const glassesEnum = require('../data/glasses.json');
const alcoholicEnum = ["Non alcoholic", "Alcoholic"]

const ingredientSchema = new Schema({
  title: String,
  measure: String,
  ingredientId: {
    type: Types.ObjectId,
    ref: 'Ingredient', 
  }
});

const recipeSchema = new Schema({
    drink: {
        type: String,
        required: [true, 'Set name for drink'],
        unique: true,
    },
    drinkAlternate: {
        type: String,
        default: "Sorry, not specified",
    },
    tags: {
        type: String,
        default: "Sorry, not specified",
    },
    video: {
        type: String,
        default: "Sorry, not specified",
    },
    category: {
        type: String,
        required: [true, 'Set category for drink'],
        enum: categoriesEnum,
    },
    IBA: {
        type: String,
        default: "Sorry, not specified",
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
        default: "Sorry, not specified",
    },
    instructions: {
        type: String,
        default: "Sorry, not specified",
    },
    instructionsES: {
        type: String,
        default: "Sorry, not specified",
    },
    instructionsDE: {
        type: String,
        default: "Sorry, not specified",
    },
    instructionsFR: {
        type: String,
        default: "Sorry, not specified",
    },
    instructionsIT: {
        type: String,
        default: "Sorry, not specified",
    },
    instructionsRU: {
        type: String,
        default: "Sorry, not specified",
    },
    instructionsPL: {
        type: String,
        default: "Sorry, not specified",
    },
    instructionsUK: {
        type: String,
        default: "Sorry, not specified",
    },
    drinkThumb: {
        type: String,
        default: "https://m.media-amazon.com/images/I/519EfrzZi9L._AC_UF894,1000_QL80_.jpg",
    },
    ingredients: {
        type: [ingredientSchema],
        required: [true, 'Recipe must have ingredients'],
    },
    shortDescription: {
        type: String,
        default: "Sorry, not specified",
    },
}, {
    versionKey: false,
})

recipeSchema.post('save', handleMongooseError);

const Recipe = model('recipe', recipeSchema);

module.exports = {
    Recipe
}
