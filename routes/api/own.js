const express = require('express');
const { getOwnRecipes, addOwnRecipe, removeOwnRecipe } = require('../../controllers/own')
const { validateBody,authenticate, isValidId } = require('../../middlewares');
const { schemas } = require('../../models/contact');


const router = express.Router();

router.use(authenticate);

router.get("/", getOwnRecipes);

router.post("/", validateBody(schemas.addSchema), addOwnRecipe);

router.delete("/:id", authenticate, isValidId, removeOwnRecipe);

module.exports = router;
