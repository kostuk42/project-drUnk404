const express = require("express");
const {
  getAllDrinksMainPage,
  getDrinkById,
  getFilteredDrinks,
  getOwnRecipes,
  removeOwnRecipe,
  addToFavorite,
  getFavorite,
  removeFromFavorite,
  addOwnDrink,
  getPopularDrinks,
} = require("../../controllers/drinks");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { addOwnDrinkJoiSchema } = require("../../models/recipes");

const router = express.Router();

router.use(authenticate);

router.get("/mainpage", getAllDrinksMainPage);
router.get("/search", getFilteredDrinks);
router.get("/popular", getPopularDrinks);

router.get("/own", getOwnRecipes);
router.post(
  "/own/add",
  upload.single("drinkThumb"),
  validateBody(addOwnDrinkJoiSchema),
  addOwnDrink
);
router.delete("/own/remove", removeOwnRecipe);

router.get("/favorite", getFavorite);
router.post("/favorite/add", addToFavorite);
router.delete("/favorite/remove", removeFromFavorite);

router.get("/:id", getDrinkById);

module.exports = router;
