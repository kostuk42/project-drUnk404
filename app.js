const express = require('express')
const logger = require('morgan')
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const contactsRouter = require('./routes/api/contacts');
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

const authRouter = require('./routes/api/auth');

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static( 'public'));

app.use('/users', authRouter)
app.use('/api/contacts', contactsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message })
})

module.exports = app
