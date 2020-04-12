const express = require('express')
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

app.use(userRoute)
app.use(portfolioRoute)

app
  .listen(port, () => {
    console.log(`Server is up on port ${port}`)
  })
  .on('error', err => {
    console.log(err)
  })
