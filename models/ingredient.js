
const {Schema, model} = require('mongoose');
const {handleMongooseError} = require("../helpers");

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


ingredientSchema.post('save', handleMongooseError)

const Ingredient = model('ingredient', ingredientSchema);

module.exports = {
    Ingredient,
};
