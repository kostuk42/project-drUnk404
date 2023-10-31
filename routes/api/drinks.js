const express = require('express');
const { getAllDrinksMainPage, getDrinkById, getFilteredDrinks, addOwnDrink} = require('../../controllers/drinks')
const {authenticate, upload, validateBody} = require('../../middlewares');
const {addOwnDrinkJoiSchema} = require("../../models/recipes");

const router = express.Router();

router.use(authenticate);

router.get('/mainpage', getAllDrinksMainPage);
router.get('/search', getFilteredDrinks);
router.get('/:id', getDrinkById);
router.post('/own/add', upload.single('drinkThumb'), validateBody(addOwnDrinkJoiSchema), addOwnDrink)

module.exports = router;
