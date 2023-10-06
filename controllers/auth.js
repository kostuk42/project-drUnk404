const {HttpError} = require("../helpers");
const {ctrlWrapper} = require("../helpers/ctrlWrapper");
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    const hashPassword = await bcrypt.hash(password, 10);

    if (user) {
        throw HttpError(409, `Email ${email} in use`)
    }

    const { subscription } = await User.create({...req.body, password: hashPassword});
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

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}
