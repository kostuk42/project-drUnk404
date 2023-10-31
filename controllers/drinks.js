const { Recipe, AddOwnDrinkSchema} = require('../models/recipes');
const { ctrlWrapper, isUserAdult } = require("../helpers")
const {Contact} = require("../models/contact");

const getAllDrinksMainPage = async (req, res) => {
    const birthDate = req.user.birthDate
    const userIsAdult = isUserAdult(birthDate)
    
    const categories = await Recipe.distinct("category");

    const randomCocktails = [];

    for (const category of categories) {
        const cocktails = await Recipe.aggregate([
            { $match: userIsAdult ? { category: category } : { category: category, alcoholic: "Non alcoholic" } },
        { $sample: { size: 3 } }
        ]);
        
    randomCocktails.push(...cocktails);
}

    const categorizedCocktails = categories.map(category => {
    const categoryCocktails = randomCocktails.filter(cocktail => cocktail.category === category);
    return {[category]: categoryCocktails}; });

    res.status(200).json({data:categorizedCocktails})
}

const getFilteredDrinks = async (req, res) => {
      const { query, user } = req;
    const birthDate = user.birthDate;
    const userIsAdult = isUserAdult(birthDate);

    const findOptions = userIsAdult ? {} : { alcoholic: "Non alcoholic" };
    const orConditions = [];

    if (query.ingredient) {
        findOptions.ingredients = { $elemMatch: { title: query.ingredient } };
    }

    if (query.search) {
        orConditions.push(
            { drink: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } },
        );
    }

    if (query.category) {
        findOptions.category = { $regex: query.category, $options: 'i' };
    }

    if (orConditions.length > 0) {
        findOptions.$or = orConditions;
    }

    const dataQuery = Recipe.find(findOptions);

    const paginationPage = query.page ? + query.page : 1;
    const paginationLimit = query.limit ? + query.limit : 10;
    const cocktailsToSkip = (paginationPage - 1) * paginationLimit;

    dataQuery.skip(cocktailsToSkip).limit(paginationLimit);
    const data = await dataQuery;
    const total = await Recipe.count(findOptions);

    res.status(200).json({data, total})
}


const getDrinkById = async (req, res) => {
    const data = await Recipe.findById(req.params.id)
    res.status(200).json({data})
}

const addOwnDrink = async (req, res) => {
    const drinkThumb = req.file?.path;
    const drink = await Recipe.findOne({drink: req.body.drink});
    if (drink) {
        res.status(409).json({message: 'Drink already exists'})
        return
    }
    const data = await Recipe.create({...req.body, drinkThumb})
    res.status(200).json({data})
}

module.exports = {
    getAllDrinksMainPage: ctrlWrapper(getAllDrinksMainPage),
    getDrinkById: ctrlWrapper(getDrinkById),
    getFilteredDrinks: ctrlWrapper(getFilteredDrinks),
    addOwnDrink: ctrlWrapper(addOwnDrink)
}
