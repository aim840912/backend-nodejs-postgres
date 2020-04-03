const express = require('express')
const moment = require('moment')

const {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  empty,
  generateUserToken
} = require('../utils/featrues')

const router = express.Router()

router.post('/user/signup', async (req, res) => {
  const { name, email, password } = req.body

  const createdTime = moment(new Date())

  if (empty(email) || empty(name)) {
    return res.status(400).send('cannot be empty')
  }

  if (!isValidEmail(email)) {
    return res.status(400).send('Please enter a valid Email')
  }

  if (!validatePassword(password)) {
    return res.status(400).send('Password must be more than five(5) characters')
  }

  const hashedPAssword = hashPassword(password)
  const createUserQuery = `INSERT INTO
  user(name,email,password,createdTime)
  VALUES($1,$2,$3,$4)
  returning *
  `
  const values = [name, email, password, createdTime]

  try {
    
  } catch (error) {
    return res.status(400).send(errorMessage)
  }
})
router.post('/user/login')

module.exports = router
