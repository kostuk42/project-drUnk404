const express = require('express');
const { getAllDrinksMainPage, getDrinkById, getFilteredDrinks } = require('../../controllers/drinks')
const {authenticate} = require('../../middlewares');

const router = express.Router();

router.use(authenticate);

router.get('/mainpage', getAllDrinksMainPage);
router.get('/search', getFilteredDrinks);
router.get('/:id', getDrinkById);

module.exports = router;
