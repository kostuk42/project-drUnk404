
const {HttpError} = require("../helpers");
const {ctrlWrapper} = require("../helpers/ctrlWrapper");

const {Contact} = require('../models/contact');

const getAll = async (req, res) => {
    const {_id: owner} = req.user;
    // const {page = 1, limit = 20} = req.query;
    // const skip = (page - 1) * limit;
    const result = await Contact.find({owner}, '_id name email phone favorite').populate('owner', 'name email');
    res.json(result)
}

const getById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findOne({ _id: contactId });
    if (!result) {
        throw HttpError(404, `Contact with id=${req.params.contactId} not found`);
    }
    res.json(result)
}

const add = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result)
}

const remove = async (req, res) => {
    const result = await Contact.findByIdAndDelete(req.params.contactId);
    if (!result) {
        throw HttpError(404, `Contact with id=${req.params.contactId} not found`);
    }
    res.json({"message": `contact ${req.params.contactId} deleted`})
}

const update = async (req, res) => {
    const result = await Contact.findByIdAndUpdate(req.params.contactId, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `Contact with id=${req.params.contactId} not found`);
    }
    res.json(result)
}

const updateStatus = async (req, res) => {
    const result = await Contact.findByIdAndUpdate(req.params.contactId, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `Contact with id=${req.params.contactId} not found`);
    }
    res.json(result)
}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    remove: ctrlWrapper(remove),
    update: ctrlWrapper(update),
    updateStatus: ctrlWrapper(updateStatus),
}
