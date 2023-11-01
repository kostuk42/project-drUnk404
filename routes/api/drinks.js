const express = require('express');
const { getAllDrinksMainPage, getDrinkById, getFilteredDrinks, getOwnRecipes, addOwnRecipe, removeOwnRecipe,addToFavorite, getFavorite, removeFromFavorite, addOwnDrink  } = require('../../controllers/drinks')
const { validateBody,authenticate, isValidId,  upload } = require('../../middlewares');
const { schemas } = require('../../models/contact');
const {addOwnDrinkJoiSchema} = require("../../models/recipes");

const router = express.Router();

router.use(authenticate);

router.get('/mainpage', getAllDrinksMainPage);
router.get('/search', getFilteredDrinks);
router.get('/:id', getDrinkById);
router.post('/own/add', upload.single('drinkThumb'), validateBody(addOwnDrinkJoiSchema), addOwnDrink)

router.post("/add/:id", validateBody(schemas.addSchema), addToFavorite);
router.get("/", getFavorite);
router.delete("/remove/:id", isValidId, removeFromFavorite);

router.get("/", getOwnRecipes);
router.post("/", validateBody(schemas.addSchema), addOwnRecipe);
router.delete("/:id", authenticate, isValidId, removeOwnRecipe);

module.exports = router;
