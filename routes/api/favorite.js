const express = require('express');
const { addToFavorite, getFavorite, removeFromFavorite } = require('../../controllers/favorite.js');
const { validateBody, authenticate, isValidId } = require('../../middlewares');
const { schemas } = require('../../models/contact');

const router = express.Router();

router.use(authenticate);

router.post(
  "/add/:id",
  validateBody(schemas.addSchema), 
  addToFavorite
);

router.get("/", getFavorite);

router.delete(
  "/remove/:id",
  isValidId, 
  removeFromFavorite
);

module.exports = router;