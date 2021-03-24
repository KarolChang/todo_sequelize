const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const PORT = process.env.PORT || 3000
const userPassport = require('./config/passport')
const route = require('./routes')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'MySecretForApp',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('__method'))

userPassport(app)

app.use(route)

// listen server
app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`)
})
