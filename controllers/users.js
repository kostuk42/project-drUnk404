const { User } = require('../models/user');
const { HttpError, sendEmail, checkUpdateUserBody} = require("../helpers");
const { ctrlWrapper } = require("../helpers/ctrlWrapper")

const getCurrent = async (req, res) => {
    const {email, avatarURL} = req.user; // update to {username, avatarURL} when the model User will be created correctly
    res.json({email, avatarURL})
}

const sendSubscriptionEmail = async (req, res) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, 'User not found')
    }
    if(user.subscription) {
        throw HttpError(400, 'User is already subscribed.')
    }

    const subscriptionEmail = {
        to: email,
        subject: 'Welcome to DrUnk404 Newsletter!',
        html: `<h3>We are thrilled to welcome you to the DrUnk404 community! Your subscription to our newsletter has been successfully processed.</h3>`
    }

    await sendEmail(subscriptionEmail);
    user.subscription = true
    await user.save()

    res.json({
        message: 'Subscription Successful!'
    })
}

const userUpdate = async (req, res) => {

    const updateAvatar = checkUpdateUserBody(req.body.username, req.file)

    if (updateAvatar) {
        const newAvatarURL = req.file.path;
        const user = await User.findById(req.user.id);
        user.avatarURL = newAvatarURL;
        await user.save();
    } else {
        const newUsername = req.body.username
        const user = await User.findById(req.user.id);
        user.username = newUsername;
        await user.save();
    }

    res.status(200).json({
        message: 'User successfully updated.'
    });
}


module.exports = {
    getCurrent: ctrlWrapper(getCurrent),
    sendSubscriptionEmail: ctrlWrapper(sendSubscriptionEmail),
    userUpdate: ctrlWrapper(userUpdate),
}