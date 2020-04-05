const { Pool } = require('pg')
// const dotenv = require('dotenv')

// const databaseConfig = { connectionString: process.env.DATABASE_URL }
const pool = new Pool({
  user: 'tien',
  password: 'aim830912',
  host: 'localhost',
  database: 'postgres',
  post: 5432
})

module.exports = pool
