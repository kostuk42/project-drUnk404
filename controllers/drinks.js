const { Recipe } = require('../models/recipes');
const { ctrlWrapper, isUserAdult, HttpError } = require("../helpers")

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
    const selectedCategories = ['Ordinary Drink', 'Cocktail', 'Shake', 'Other/Unknown'];
    const categorizedCocktails = randomCocktails.reduce((acc, cocktail) => {
        const { category } = cocktail;
        if (!selectedCategories.includes(category)) {return acc}
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(cocktail);
        return acc;
    }, {})

    res.status(200).json(categorizedCocktails);
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


const addToFavorite = async (req, res) => {

  const { id: recipeId } = req.body;
  const { _id: userId } = req.user;

  let favoriteRecipe = await Recipe.findById(recipeId);


  if (!favoriteRecipe) {
    throw HttpError(404);
  }
  
  if (favoriteRecipe.favorite) {
    if (!favoriteRecipe.favorite.includes(userId)) {
      favoriteRecipe.favorite.push(userId);
    }
  } else {
    favoriteRecipe = { ...favoriteRecipe, favorite: [userId] };
  }

    favoriteRecipe.glass = favoriteRecipe.glass.toLowerCase();
  await favoriteRecipe.save();

  res.json(favoriteRecipe);
};

const getFavorite = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const { _id } = req.user;

  const skip = (page - 1) * limit;
  const numberPage = Number(page);
  const numberLimit = Number(limit);

  const result = await Recipe.find({ favorite: _id }, "", {
    skip,
    limit,
  }).lean();

  const totalHits = await Recipe.countDocuments({ favorite: _id });

  res.json({ page: numberPage, limit: numberLimit, totalHits, result });
};

const removeFromFavorite = async (req, res) => {
  const { id } = req.body;
  const { _id } = req.user;
  console.log(id);

  const result = await Recipe.findById(id);
  if (!result) {
    throw HttpError(404);
  }

  if (result.favorite) {
    if (result.favorite.includes(_id)) {
      const index = result.favorite.indexOf(_id);
      result.favorite.splice(index, 1);
    }
  }

  await result.save();

  res.json({ result });
};

const getOwnRecipes = async (req, res) => {
  console.log("here");
  const { _id: userId } = req.user;
  const result = await Recipe.find({ userId });
  res.json(result);
};

const removeOwnRecipe = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.body;

  const deletedRecipe = await Recipe.findById(id);
  if (!deletedRecipe) {
    throw HttpError(404);
  }

  if (JSON.stringify(deletedRecipe.userId) === JSON.stringify(_id)) {
    await deletedRecipe.deleteOne();
  } else {
    throw HttpError(400);
  }

  res.json({ message: "Successfully deleted!" });
};

const addOwnDrink = async (req, res) => {
    console.log("req.body");
    console.log(req.body);
    const drinkThumb = req.file?.path;
    if(drinkThumb){
        req.body.drinkThumb = drinkThumb
    }
    const userId = req.user._id;
    const createdAt = Date.now()
    const drink = await Recipe.findOne({drink: req.body.drink});
    if (drink) {
        res.status(409).json({message: 'Drink already exists'})
        return
    }
    const data = await Recipe.create({...req.body, userId, createdAt})
    res.status(200).json({data})
}

const getPopularDrinks = async (req, res) =>{
  const cocktails = await Recipe.find()
  const sortedCocktails = cocktails.sort((a, b) => b.favorite.length - a.favorite.length);
  res.status(200).json({sortedCocktails})
}

module.exports = {
    getAllDrinksMainPage: ctrlWrapper(getAllDrinksMainPage),
    getDrinkById: ctrlWrapper(getDrinkById),
    getFilteredDrinks: ctrlWrapper(getFilteredDrinks),
    addToFavorite: ctrlWrapper(addToFavorite),
    getFavorite: ctrlWrapper(getFavorite),
    removeFromFavorite: ctrlWrapper(removeFromFavorite),
    getOwnRecipes: ctrlWrapper(getOwnRecipes),
    removeOwnRecipe: ctrlWrapper(removeOwnRecipe),
    addOwnDrink: ctrlWrapper(addOwnDrink),
    getPopularDrinks: ctrlWrapper(getPopularDrinks),
}
