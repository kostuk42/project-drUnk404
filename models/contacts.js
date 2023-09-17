const fs = require('fs/promises');
const contacts = require('./contacts.json');
const path = require('path');

const contactsPath = path.join(__dirname, 'contacts.json');


const listContacts = async () => {
    return contacts;
}

const getContactById = async (contactId) => {
    const contact = contacts.find(item => item.id === contactId);
    return contact || null;
}

const removeContact = async (contactId) => {
    const index = contacts.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }
    const [contact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return contact;
}

const addContact = async (body) => {
    const newContact = {...body, id: String(new Date().getTime())};
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return newContact;
}

const updateContact = async (contactId, body) => {
    const index = contacts.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }
    const contact = {...contacts[index], ...body};
    contacts[index] = contact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return contact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
