const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const userRoute = require('./routes/user')

// create a new Express app server object
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(userRoute)

app.listen(3000).on('listening', () => {
  console.log('start on the port 3000')
})
