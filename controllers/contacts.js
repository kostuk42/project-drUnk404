const contacts = require("../models/contacts");
const {HttpError} = require("../helpers");
const {ctrlWrapper} = require("../helpers/ctrlWrapper");
const getAll = async (req, res) => {
    const result = await contacts.listContacts();
    res.json(result)
}

const getById = async (req, res) => {
    const result = await contacts.getContactById(req.params.contactId);
    if (!result) {
        throw HttpError(404, `Contact with id=${req.params.contactId} not found`);
    }
    res.json(result)
}

const add = async (req, res) => {
    const result = await contacts.addContact(req.body);
    res.status(201).json(result)
}

const remove = async (req, res) => {
    const result = await contacts.removeContact(req.params.contactId);
    if (!result) {
        throw HttpError(404, `Contact with id=${req.params.contactId} not found`);
    }
    res.json({"message": `contact ${req.params.contactId} deleted`})
}

const update = async (req, res) => {
    const result = await contacts.updateContact(req.params.contactId, req.body);
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
    update: ctrlWrapper(update)
}
