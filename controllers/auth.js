const {HttpError} = require("../helpers");
const {ctrlWrapper} = require("../helpers/ctrlWrapper");
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require("fs/promises");
const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    const avatarURL = gravatar.url(email, {s: '250'}, true);

    const hashPassword = await bcrypt.hash(password, 10);

    if (user) {
        throw HttpError(409, `Email ${email} in use`)
    }

    const { subscription } = await User.create({...req.body, password: hashPassword, avatarURL});
    res.status(201).json({user: {
        email, subscription}
    })
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, 'Email or password is wrong')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        throw HttpError(401, 'Email or password is wrong')
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '23h'});
    const {subscription} = await User.findByIdAndUpdate(user._id, {token});

    res.json({
        user: {email, subscription},
        token,
    })
}

const getCurrent = async (req, res) => {
    const {email, subscription} = req.user;
    res.json({email, subscription})
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

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}
