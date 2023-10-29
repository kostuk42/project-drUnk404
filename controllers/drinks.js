const { Recipe } = require('../models/recipes');
const { ctrlWrapper, isUserAdult } = require("../helpers")

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
    const filter = req.query
    const birthDate = req.user.birthDate
    const userIsAdult = isUserAdult(birthDate)
    const isFiltered = Object.keys(filter).length !== 0
    const filterFields = ["drink", "category"]

    const findOptions = userIsAdult ? {} : { alcoholic: "Non alcoholic"}
    if (isFiltered) {
        if (filter.ingredient) {
            findOptions.ingredients = { $elemMatch: { title: filter.ingredient } }
        }
        filterFields.forEach(field => {
            if (filter[field]) {
      findOptions[field] = { $regex: filter[field], $options: 'i' };
    }
        });
    }
    const dataQuery = Recipe.find(findOptions);

    const paginationPage = filter.page ? + filter.page : 1;
    const paginationLimit = filter.limit ? + filter.limit : 10;
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

module.exports = {
    getAllDrinksMainPage: ctrlWrapper(getAllDrinksMainPage),
    getDrinkById: ctrlWrapper(getDrinkById),
    getFilteredDrinks: ctrlWrapper(getFilteredDrinks),
}
