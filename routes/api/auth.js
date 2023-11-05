const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const router = express.Router();

const {
  register,
  login,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");

router.post("/signup", validateBody(schemas.registerJoiSchema), register);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(schemas.emailJoiSchema), resendVerifyEmail);

router.post("/signin", validateBody(schemas.loginJoiSchema), login);

router.post("/signout", authenticate, logout);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
