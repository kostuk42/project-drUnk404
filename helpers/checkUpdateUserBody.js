const {HttpError} = require("./HttpError");


const checkUpdateUserBody = (username, file) => {
    if (file) {
        return true
    } else if (username) {
        return false
    } 
    throw HttpError(400, 'Please provide data to update.')
}

module.exports = {
    checkUpdateUserBody
}