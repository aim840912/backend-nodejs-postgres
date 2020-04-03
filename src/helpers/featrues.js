const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)
const hashPassword = password => bcrypt.hashSync(password, salt)

const comparePassword = (hashedPassword, password) => {
  return bcrypt.compareSync(password, hashedPassword)
}

const isValidEmail = email => {
  // 不太懂regEx
  const regEx = /\S+@\S+\.\S+/
  return regEx.test(email)
}

const validatePassword = password => {
  if (password.length <= 5 || password === '') {
    return false
  }
  return true
}

const empty = input => {
  if (input === undefined || input === '') {
    return true
  }
  return false
}

const generateUserToken = (email, id) => {
  const token = jwt.sign(
    {
      email,
      user_id: id
    },
    'secretToken',
    { expiresIn: '3d' }
  )
  return token
}

module.exports = {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  empty,
  generateUserToken
}
