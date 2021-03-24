const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')
const { authenticate } = require('../middleware/auth')

router.use('/users', users)
router.use('/todos', authenticate, todos)
router.use('/', authenticate, home)

module.exports = router
