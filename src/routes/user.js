const express = require('express')
const moment = require('moment')

const dbQuery = require('../db/dbQuery')
const { errorMessage, successMessage, status } = require('../helpers/status')
const {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  empty,
  generateUserToken
} = require('../helpers/featrues')

const router = express.Router()

router.post('/user/signup', async (req, res) => {
  const { name, email, password } = req.body

  const createdTime = moment(new Date())

  if (empty(email) || empty(name)) {
    return res.status(status.bad).send('cannot be empty')
  }

  if (!isValidEmail(email)) {
    return res.status(status.bad).send('Please enter a valid Email')
  }

  if (!validatePassword(password)) {
    return res
      .status(status.bad)
      .send('Password must be more than five(5) characters')
  }

  const hashedPAssword = hashPassword(password)
  const createUserQuery = `INSERT INTO
  user(name,email,password,createdTime)
  VALUES($1,$2,$3,$4)
  returning *`

  const values = [name, email, hashedPAssword, createdTime]

  try {
    const { rows } = await dbQuery.query(createUserQuery, values)
    const dbResponse = rows[0]
    delete dbResponse.password
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.name
    )
    successMessage.data = dbResponse
    successMessage.data.token = token
    return res.status(status.created).send(successMessage)
  } catch (error) {
    errorMessage.error = 'Operation was not successful'
    return res.status(status.conflict).send(errorMessage)
  }
})
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body
  if (empty(email) || empty(password)) {
    return res.status(status.bad).send('cannot be empty')
  }

  if (!isValidEmail(email) || !validatePassword(password)) {
    return res.status(status.bad).send('Please enter a valid Email or password')
  }

  const loginUserQuery = 'SELECT * FROM user WHERE email =$1'
  try {
    const { rows } = await dbQuery.query(loginUserQuery, [email])
    const dbResponse = rows[0]
    if (!dbResponse) {
      errorMessage.error = 'User with this email does not exist'
      return res.status(status.notfound).send(errorMessage)
    }
    if (!comparePassword(dbResponse.password, password)) {
      errorMessage.error = 'The password you provided is incorrect'
      return res.status(status.bad).send(errorMessage)
    }
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.name
    )
    delete dbResponse.password
    successMessage.data = dbResponse
    successMessage.data.token = token
    return res.status(status.success).send(successMessage)
  } catch (error) {
    errorMessage.error = 'Operation was not successful'
    return res.status(status.error).send(errorMessage)
  }
})

module.exports = router
