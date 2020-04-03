// const pool = require('./pool')

// pool.on('connect', () => {
//   console.log('connected to the db')
// })

// const getUsers = (req, res) => {
//   pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
//     if (err) {
//       throw err
//     }
//     res.status(200).json(results.rows)
//   })
// }

// const getUserById = (req, res) => {
//   const id = parseInt(req.params.id)

//   pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
//     if (err) {
//       throw err
//     }
//     res.status(200).json(results.rows)
//   })
// }

// const createUser = (req, res) => {
//   const { name, email } = req.body

//   pool.query(
//     'INESERT INTO users (name,email) VALUES ($1 $2)',
//     [name, email],
//     (err, results) => {
//       if (err) {
//         throw err
//       }
//       res.status(201).send(`User added with ID: ${results.insertId}`)
//     }
//   )
// }

// const updateUser = (req, res) => {
//   const id = parseInt(req.params.id)

//   const { name, email } = req.body

//   pool.query(
//     'UPDATE users SET name =$1,email=$2 WHERE id =$3',
//     [name, email, id],
//     (err, results) => {
//       if (err) {
//         throw err
//       }
//       res.status(200).send(`User modified with ID: ${id}`)
//     }
//   )
// }

// const deleteUser = (req, res) => {
//   const id = parseInt(req.params.id)

//   pool.query('DELETE FROM users WHERE id=$1', [id], (err, results) => {
//     if (err) {
//       throw err
//     }
//     res.status(200).send(`User deleted with ID: ${id}`)
//   })
// }
// module.exports = {
//   getUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser
// }
