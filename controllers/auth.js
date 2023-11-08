const { HttpError, sendEmail } = require("../helpers");
const { ctrlWrapper } = require("../helpers/ctrlWrapper");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { username, birthDate, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) throw HttpError(409, `Email ${email} in use`);

  // create new user
  const newUser = new User({ username, email, birthDate });
  const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  newUser.setPassword(password);
  newUser.token = token;
  newUser.verificationToken = nanoid();

  newUser.avatarURL = 'https://res.cloudinary.com/dpwzetehz/image/upload/v1699438507/avatars/defaultAvatar1699438507077.png'

  await newUser.save();

  res.status(201).json({
    token,
    user: {
      username,
      email,
      birthDate,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { password: bodyPassword, email: bodyEmail } = req.body;

  const user = await User.findOne({ email: bodyEmail });

  //   if (!user.verify)
  //     return res.status(400).json({ message: "Must verify email" });

  if (!user || !user.validPassword(bodyPassword))
    return res.status(400).json({ message: "Incorrect email or password" });

  const { email, _id, username, birthDate } = user;

  const token = jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "1h" });

  await User.findOneAndUpdate({ _id }, { token: token });

  res.status(200).json({
    token,
    user: {
      username,
      email,
      birthDate,
      avatarURL: user.avatarURL,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({});
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempPath, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultPath = path.join(avatarsDir, fileName);
  await fs.rename(tempPath, resultPath);
  const img = await Jimp.read(resultPath);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(resultPath);

  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

// example of avatar controller
const saveAvatar = async (req, res) => {
  // the path is src to the image and should be saved in the db with a user it belongs to.
  const url = req.file.path;
  console.log("file url:");
  console.log(url);
  res.json({
    message: "Image saved successfully",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  saveAvatar: ctrlWrapper(saveAvatar),
};
