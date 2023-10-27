
const {Schema, model} = require('mongoose');

const ingredientSchema = new Schema({

    title:{
        type: String,
    },
    ingredientThumb:{
        type: String,
    },
    abv:{
        type: String,
    },

    alcohol:{
        type: String,
    },

    description:{
        type: String,
    },

    type:{
        type: String,
    },

    flavour:{
        type: String,
    },

    country:{
        type: String,
    },
}
);

const Ingredient = model('ingredient', ingredientSchema);

module.exports = {
    Ingredient,
};
