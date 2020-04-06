const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

// const databaseConfig = { connectionString: process.env.DATABASE_URL }
const pool = new Pool({
  user: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DATABASE,
  post: process.env.POSTGRESQL_POST
})

module.exports = pool
