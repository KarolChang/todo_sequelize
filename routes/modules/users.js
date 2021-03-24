const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login', { email: req.session.email })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields are required!' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'password is not equal to confirmPassword!' })
  }
  if (errors.length) {
    return res.render('register', { name, email, password, confirmPassword, errors })
  }
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: 'User already exists!' })
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword,
        errors
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.session.email = email
        req.flash('success_msg', `${email} registered successfully!`)
        res.redirect('/users/login')
      })
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.session.email = ''
  req.logout()
  req.flash('success_msg', 'logout successfully!')
  return res.redirect('/users/login')
})

module.exports = router
