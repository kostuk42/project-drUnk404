const fs = require("fs/promises");
const Recipe = require("../models/recipes.js");
const HttpError = require("../helpers/index.js");
const upload = require("../middlewares/upload.js") ;
const { ctrlWrapper } = require("../helpers")

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
  getOwnRecipes: ctrlWrapper(getOwnRecipes),
  addOwnRecipe: ctrlWrapper(addOwnRecipe),
  removeOwnRecipe: ctrlWrapper(removeOwnRecipe),
};