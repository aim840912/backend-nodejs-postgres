const express = require('express')
const moment = require('moment')

const router = express.Router()

router.post('/user/signup', async (req, res) => {
  const { email, password } = req.body

  const createdTime = moment(new Date())
})
router.post('/user/login')

export default router
