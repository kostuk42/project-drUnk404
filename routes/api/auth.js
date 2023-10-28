const express = require('express');
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/upload');
const router = express.Router();

const {register, login, logout, updateAvatar, verifyEmail, resendVerifyEmail, saveAvatar} = require('../../controllers/auth');
const {validateBody} = require('../../middlewares');
const {schemas} = require('../../models/user');


router.post('/register', validateBody(schemas.registerJoiSchema), register);

router.get('/verify/:verificationToken', verifyEmail);

router.post('/verify', validateBody(schemas.emailJoiSchema), resendVerifyEmail);

router.post('/login', validateBody(schemas.loginJoiSchema), login);

router.post('/logout', authenticate, logout);

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);
// the route example to demonstrate how to use cloudinary. You should remove it or change as necessary.
router.post('/avatars', upload.single('avatar'), saveAvatar);

module.exports = router;
