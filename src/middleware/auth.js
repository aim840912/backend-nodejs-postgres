const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { errorMessage, status } = require('../helpers/status')

dotenv.config()

const verifyToken = async (req, res, next) => {
  console.log('token')
  const token = req.header('Authorization').replace('Bearer ', '')
  console.log(token)
  if (!token) {
    errorMessage.error = 'Token not provided'
    return res.status(status.bad).send(errorMessage)
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    req.user = {
      email: decoded.email,
      user_id: decoded.id,
      name: decoded.name
    }
    return next()
  } catch (error) {
    errorMessage.error = 'Authentication Failed'
    return res.status(status.unauthorized).send(errorMessage)
  }
}

module.exports = verifyToken
