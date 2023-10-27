const fs = require('fs').promises;
const path = require('path');
const {Ingredient} = require('../models/ingredient');

const {ctrlWrapper} = require("../helpers/ctrlWrapper");

const glassesPath = path.join(path.dirname(__dirname), "data", "glasses.json");
const categoriesPath = path.join(path.dirname(__dirname), "data", "categories.json");

const getAllCategories = async (req, res) => {
    const response = await fs.readFile(categoriesPath)
    const data = JSON.parse(response)
    res.status(200).json({data})
}

const getAllGlasses = async (req, res) => {
    const response = await fs.readFile(glassesPath)
    const data = JSON.parse(response)
    res.status(200).json({data})
}

const getAllIngredients = async (req, res) => {
    const data = await Ingredient.find()
    res.status(200).json({data})
}

module.exports = {
    getAllCategories: ctrlWrapper(getAllCategories),
    getAllGlasses: ctrlWrapper(getAllGlasses),
    getAllIngredients: ctrlWrapper(getAllIngredients),
}
