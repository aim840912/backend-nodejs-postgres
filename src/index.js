const express = require('express')
const bodyParser = require('body-parser')

const userRoute = require('./routes/user')

// create a new Express app server object
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(userRoute)

app.listen(3000).on('listening', () => {
  console.log('start on the port 3000')
})
