const { User } = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");
const { ctrlWrapper } = require("../helpers/ctrlWrapper");

const getCurrent = async (req, res) => {
  const currentUser = req.user.toObject();
  delete currentUser.password;
  res.status(200).json(currentUser);
};

const sendSubscriptionEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.subscribe) {
    throw HttpError(400, "User is already subscribed.");
  }

  const subscriptionEmail = {
    to: email,
    subject: "Welcome to DrUnk404 Newsletter!",
    html: `<h3>We are thrilled to welcome you to the DrUnk404 community! Your subscription to our newsletter has been successfully processed.</h3>`,
  };

  await sendEmail(subscriptionEmail);
  user.subscribe = true;
  await user.save();

  res.status(200).json({
    message: "Subscription Successful!",
  });
};

const userUpdate = async (req, res) => {
  const user = await User.findById(req.user.id);

  const newAvatarURL = req.file ? req.file.path : user.avatarURL;
  const newUsername = req.body.username ? req.body.username : user.username;

  user.avatarURL = newAvatarURL;
  user.username = newUsername;

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;
  res.status(200).json(updatedUser);
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  sendSubscriptionEmail: ctrlWrapper(sendSubscriptionEmail),
  userUpdate: ctrlWrapper(userUpdate),
};
