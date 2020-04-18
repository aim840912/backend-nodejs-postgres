const moment = require('moment')
const express = require('express')
const multer = require('multer')

const dbQuery = require('../db/dbQuery')
const auth = require('../middleware/auth')
const { empty } = require('../helpers/featrues')
const { errorMessage, successMessage, status } = require('../helpers/status')

const router = express.Router()

const imageUploadRule = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(_req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

router.post(
  '/portfolio',
  auth,
  imageUploadRule.single('myImage'),
  async (req, res) => {
    const { title, url, intro, photo } = req.body
    console.log(req.body)
    const owner = req.user.name
    console.log(owner)
    const createdTime = moment(new Date())

    if (empty(title) || empty(url)) {
      errorMessage.error = 'title and url is required'
      return res.status(status.bad).send(errorMessage)
    }

    const createPortfolioQuery = `INSERT INTO
  portfolio(
    owner,
    title,
    url,
    intro,
    photo,
    createdTime)
  VALUES($1,$2,$3,$4,$5,$6)
  returning *`

    const values = [owner, title, url, intro, photo, createdTime]

    try {
      console.log('trycatchport')
      const { rows } = await dbQuery.query(createPortfolioQuery, values)
      const dbReponse = rows[0]
      console.log(dbReponse)
      successMessage.data = dbReponse
      return res.status(status.created).send(successMessage)
    } catch (error) {
      console.log(error)
      errorMessage.error = 'Unable to create'
      return res.status(status.error).send(errorMessage)
    }
  }
)

router.get('/portfolio', auth, async (_req, res) => {
  const getPortfolio = `SELECT * FROM portfolio ORDER BY createdTime DESC`

  try {
    const { rows } = await dbQuery.query(getPortfolio)
    const dbResponse = rows
    if (dbResponse[0] === undefined) {
      errorMessage.error = 'There are no profolio'
      return res.status(status.bad).send(errorMessage)
    }
    successMessage.data = dbResponse
    return res.status(status.success).json({ successMessage })
  } catch (error) {
    console.log(error)
    errorMessage.error = 'An error Occured'
    return res.status(status.error).send(errorMessage)
  }
})

router.delete('/portfolio/:portfolio', auth, async (req, res) => {
  const { portfolio } = req.params
  const { userId } = req.user
  const deletePortfolioQuery = `DELETE FORM portfolio WHERE id=$1 AND user_id = $2 returning *`
  try {
    const { rows } = await dbQuery.query(deletePortfolioQuery, [
      portfolio,
      userId
    ])
    const dbResponse = rows[0]
    if (!dbResponse) {
      errorMessage.error = 'You have no portfolio with that id'
      return res.status(status.notfound).send(errorMessage)
    }
    successMessage.data = {}
    successMessage.data.message = 'Portfolio deleted successfully'
    return res.status(status.success).send(successMessage)
  } catch (error) {
    return res.status(status.error).send(error)
  }
})

router.put('/portfolio/:portfolio', auth, async (req, res) => {
  const { portfolio } = req.params
  const { title, url, description } = req.body

  const { userId } = req.user
  if (empty(title) || empty(url)) {
    errorMessage.err = 'Must be required'
    return res.status(status.bad).send(errorMessage)
  }
  const findPortfolioQuery = `SELECT * FROM portfolio WHERE id=$1`
  const updatePortfolio = `UPDATE portfolio SET title=$1 url=$2 descritpion=$3 WHERE userId=$4 AND id=$5 return *`

  try {
    const { rows } = await dbQuery.query(findPortfolioQuery, [portfolio])
    const dbResponse = rows[0]
    if (!dbResponse) {
      errorMessage.error = 'Booking Cannot be found'
      return res.status(status.notfound).send(errorMessage)
    }
    const values = [title, url, description]
    const response = await dbQuery.query(updatePortfolio, values)
    const dbResult = response.rows[0]
    delete dbResult.password
    successMessage.data = dbResult
    return res.status(status.success).send(successMessage)
  } catch (error) {
    errorMessage.error = 'Operation was not successful'
    return res.status(status.error).send(errorMessage)
  }
})

module.exports = router
