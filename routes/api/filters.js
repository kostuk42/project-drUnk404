const express = require('express');
const { getAllCategories, getAllIngredients, getAllGlasses } = require('../../controllers/filters')
const {authenticate} = require('../../middlewares');

const router = express.Router();

router.use(authenticate);

router.get('/categories', getAllCategories);
router.get('/glasses', getAllGlasses);
router.get('/ingredients', getAllIngredients);

module.exports = router;
