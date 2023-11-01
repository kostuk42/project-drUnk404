const express = require('express');
const { getAllDrinksMainPage, getDrinkById, getFilteredDrinks, getOwnRecipes, removeOwnRecipe,addToFavorite, getFavorite, removeFromFavorite, addOwnDrink  } = require('../../controllers/drinks')
const { validateBody,authenticate, upload } = require('../../middlewares');
const {addOwnDrinkJoiSchema} = require("../../models/recipes");

const router = express.Router();

router.use(authenticate);

router.get('/mainpage', getAllDrinksMainPage); 
router.get('/search', getFilteredDrinks); 

router.get('/own', getOwnRecipes); 

router.post('/own/add', upload.single('drinkThumb'), validateBody(addOwnDrinkJoiSchema), addOwnDrink)  

router.post("/favorite/add", addToFavorite); 
router.get("/favorite", getFavorite); 
router.delete("/remove", removeFromFavorite); 
router.delete("/own/remove", authenticate, removeOwnRecipe);

router.get('/:id', getDrinkById); 

module.exports = router;
