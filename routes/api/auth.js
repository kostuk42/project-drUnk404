const express = require('express');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();

const {register, login, getCurrent, logout} = require('../../controllers/auth');
const {validateBody} = require('../../middlewares');
const {schemas} = require('../../models/user');

router.post('/register', validateBody(schemas.registerJoiSchema), register);

router.post('/login', validateBody(schemas.loginJoiSchema), login);

router.get('/current', authenticate, getCurrent);

router.post('/logout', authenticate, logout);

module.exports = router;
