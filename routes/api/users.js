const express = require('express');
const { getCurrent, userUpdate, sendSubscriptionEmail } = require('../../controllers/users');
const { validateBody } = require('../../middlewares');
const {schemas} = require('../../models/user');
// const { authenticate } = require('../../middlewares'); 
const upload = require("../../middlewares/upload")

const router = express.Router();

// router.use(authenticate);

router.get('/current', getCurrent);

router.patch('/update', upload.single('avatar'), userUpdate);

router.post('/subscribe', validateBody(schemas.subscribeJoiSchema), sendSubscriptionEmail);

module.exports = router;
