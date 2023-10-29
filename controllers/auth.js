const {HttpError, sendEmail} = require("../helpers");
const {ctrlWrapper} = require("../helpers/ctrlWrapper")
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require("fs/promises");
const Jimp = require("jimp");
const {nanoid} = require('nanoid');

const {BASE_URL} = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
    const {email, password} = req.body;
    console.log(email);
    const user = await User.findOne({email});
    
    const avatarURL = gravatar.url(email, {s: '250'}, true);

    const verificationToken = nanoid();

    const hashPassword = await bcrypt.hash(password, 10);

    if (user) {
        throw HttpError(409, `Email ${email} in use`)
    }

    const { subscription } = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

    const verifyEmail = {
        to: email,
        subject: 'Verify your email',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify</a>`
    }
    await sendEmail(verifyEmail);
    res.status(201).json({user: {
        email, subscription}
    })
}

const verifyEmail = async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw HttpError(404, 'User not found')
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});
    res.json({
        message: 'Verification successful'
    })
}

const resendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, 'Email not found')
    }
    if(user.verify) {
        throw HttpError(400, 'Verification has already been passed')
    }
    const verifyEmail = {
        to: email,
        subject: 'Verify your email',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify</a>`
    }

    await sendEmail(verifyEmail);
    res.json({
        message: 'Verification email sent'
    })
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, 'Email or password is wrong')
    }

    if(!user.verify) {
        throw HttpError(401, 'Email is not verified')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        throw HttpError(401, 'Email or password is wrong')
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '23h'});
    const { subscription } = await User.findByIdAndUpdate(user._id, { token });

    res.json({
        user: {email, subscription},
        token,
    })
}

const logout = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ''});
    res.status(204).json({})
}

const updateAvatar = async (req, res) => {
   const {_id} = req.user;
        const {path: tempPath, originalname} = req.file;
        const fileName = `${_id}_${originalname}`;
        const resultPath = path.join(avatarsDir, fileName);
        await fs.rename(tempPath, resultPath);
        const img = await Jimp.read(resultPath);
        await img.autocrop().cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).writeAsync(resultPath);
        // await img.resize(250, 250).write(resultPath);
        const avatarURL = path.join('avatars', fileName);
        await User.findByIdAndUpdate(_id, {avatarURL});
        res.json({avatarURL});
}

// example of avatar controller
const saveAvatar = async (req, res) => {
    // the path is src to the image and should be saved in the db with a user it belongs to.
    const url = req.file.path;
    console.log("file url:")
    console.log(url);
    res.json({
        message: "Image saved successfully"
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    saveAvatar: ctrlWrapper(saveAvatar),
}
