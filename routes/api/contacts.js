const express = require('express')

const router = express.Router()

const ctrl = require('../../controllers/contacts');
const {validateBody, isValidId, authenticate} = require('../../middlewares');
const {schemas} = require('../../models/contact');

router.get('/', authenticate, ctrl.getAll);

router.get('/:contactId', authenticate, isValidId, ctrl.getById)

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.add)

router.delete('/:contactId', authenticate, isValidId, ctrl.remove)

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.update)

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateStatusSchema), ctrl.updateStatus)

module.exports = router
