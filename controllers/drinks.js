const { Recipe } = require('../models/recipes');
const { ctrlWrapper, isUserAdult } = require("../helpers")
const HttpError = require("../helpers/index.js");
const upload = require("../middlewares/upload.js");
const fs = require("fs/promises");

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
            { shortDescription: { $regex: query.search, $options: 'i' } },
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

const errStatus = 404;
const addToFavorite = async (req, res) => {
  const { id: recipeId } = req.params;
  const { _id: userId } = req.user;

  let favoriteRecipe = await Recipe.findById(recipeId);

  if (!favoriteRecipe) {
    throw HttpError(errStatus);
  }

  if (favoriteRecipe.favorite) {
    if (!favoriteRecipe.favorite.includes(userId)) {
      favoriteRecipe.favorite.push(userId);
    }
  } else {
    favoriteRecipe = { ...favoriteRecipe, favorite: [userId] };
  }

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

const removeFromFavorite = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  const result = await Recipe.findById(id);

  if (!result) {
    throw HttpError(errStatus);
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
  const { _id: owner } = req.user;
  const result = await Recipe.find({ owner });
  res.json(result);
};

const removeOwnRecipe = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;

  const deletedRecipe = await Recipe.findById(id);
  if (!deletedRecipe) {
    throw HttpError(404);
  }

  if (JSON.stringify(deletedRecipe.owner) === JSON.stringify(_id)) {
    await deletedRecipe.deleteOne();
  } else {
    throw HttpError(403);
  }

  res.json({ deletedRecipe });
};

const addOwnRecipe = async (req, res) => {
  const { _id: owner } = req.user;
  if (!req.file) {
    const newRecipe = await Recipe.create({ ...req.body, drinkThumb: null, owner });
    return req.json(newRecipe);
  }

  const { path: tempUpload, originalname } = req.file;

  try {
    const fileName = `${owner}_${originalname}`;

    const { url: drinkThumb } = await upload.uploader.upload(tempUpload, {
      folder: "recipes",
      public_id: fileName,
      quality: 60,
      crop: "fill",
    });

    const newRecipe = await Recipe.create({
      ...req.body,
      drinkThumb,
      owner,
    });

    await fs.unlink(tempUpload);

    res.status(201).json(newRecipe);
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

module.exports = {
    getAllDrinksMainPage: ctrlWrapper(getAllDrinksMainPage),
    getDrinkById: ctrlWrapper(getDrinkById),
    getFilteredDrinks: ctrlWrapper(getFilteredDrinks),
    addToFavorite: ctrlWrapper(addToFavorite),
    getFavorite: ctrlWrapper(getFavorite),
    removeFromFavorite: ctrlWrapper(removeFromFavorite),
    getOwnRecipes: ctrlWrapper(getOwnRecipes),
    addOwnRecipe: ctrlWrapper(addOwnRecipe),
    removeOwnRecipe: ctrlWrapper(removeOwnRecipe),
}
