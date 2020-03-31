const express = require('express')
const { Client } = require('pg')
const bodyParser = require('body-parser')

// create a new Express app server object
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// set the port for the Node application
const port = process.env.port || 3456

// set the file path for the HTML file
// const htmlPath = path.join(__dirname + '/index.html')

// create a client instance of the pg library
const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'tien',
  database: 'postgres',
  port
})

client
  .connect()
  .then(() => console.log(`Connect Successfully ${port}`))
  .then(() => client.query('select * from employees'))
  .then(result => console.table(result.rows))
  .catch(e => console.log(e))
  .finally(() => client.end())
