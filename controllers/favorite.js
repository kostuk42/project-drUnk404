const Recipe = require("../models/recipes.js");
const HttpError = require("../helpers/index.js");
const { ctrlWrapper } = require("../helpers");

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

module.exports = {
  addToFavorite: ctrlWrapper(addToFavorite),
  getFavorite: ctrlWrapper(getFavorite),
  removeFromFavorite: ctrlWrapper(removeFromFavorite),
}