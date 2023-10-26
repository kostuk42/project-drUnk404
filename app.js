const express = require('express')
const logger = require('morgan')
const cors = require('cors');


const contactsRouter = require('./routes/api/contacts');
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

const authRouter = require('./routes/api/auth');
const filtersRouter = require('./routes/api/filters');

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static( 'public'));

app.use('/users', authRouter)
app.use('/api/contacts', contactsRouter)
app.use('/filters', filtersRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message })
})

module.exports = app
