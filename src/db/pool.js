const {Pool}=require('pg')

const databaseConfig = { connectionString: env.database_url };
const pool = new Pool({
    user: 'tien',
    password: 'tien',
    host: 'localhost',
    database: 'userDB',
    post: 5432
  })

  export default pool