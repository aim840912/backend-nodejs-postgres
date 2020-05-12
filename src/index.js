const express = require('express')
const session = require('express-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
const port = process.env.PORT || 3000

const userRoute = require('./routes/user')
const portfolioRoute = require('./routes/portfolio')

// create a new Express app server object
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  session({
    secret: 'nksnfoiehhrekwqnrlkje',
    resave: 'false',
    saveUninitialized: 'false'
  })
)

// Initialize passport
app.use(passport.initialize())
// used for persistent login sessions
app.use(passport.session())

// include strategy configuration
require('./config/passport')(passport)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

app.use(userRoute)
app.use(portfolioRoute)

app
  .listen(port, () => {
    console.log(`Server is up on port ${port}`)
  })
  .on('error', err => {
    console.log(err)
  })
