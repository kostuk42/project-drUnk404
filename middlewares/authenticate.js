const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization.split("Bearer").join("").trim();
    const verify = jwt.verify(token, process.env.SECRET_KEY);

    const { _id } = verify;

    const user = await User.findOne({ _id });

    if (!user || token !== user.token) {
      throw HttpError(400, "");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
