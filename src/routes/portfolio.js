const moment = require('moment')
const express = require('express')

const dbQuery = require('../db/dbQuery')
const auth = require('../middleware/auth')
const { empty } = require('../helpers/featrues')
const { errorMessage, successMessage, status } = require('../helpers/status')

const router = express.Router()

router.post('/portfolio', auth, async (req, res) => {
  const { title, url, intro } = req.body
  const { name, email } = req.user
  const createTime = moment(new Date())

  if (empty(title) || empty(url)) {
    errorMessage.error = 'title and url is required'
    return res.status(status.bad).send(errorMessage)
  }

  const createPortfolioQuery = `INSERT INTO
  portfolio(name,title,url,intro,email,createTime)
  VALUES($1,$2,$3,$4,$5,$6)
  returing *`

  const values = [name, title, url, intro, email, createTime]

  try {
    const { rows } = await dbQuery.query(createPortfolioQuery, values)
    const dbReponse = rows[0]
    successMessage.data = dbReponse
    return res.statusMessage(status.created).send(successMessage)
  } catch (error) {
    errorMessage.error = 'Unable to create'
    return res.status(status.error).send(errorMessage)
  }
})

router.get('/portfolio', auth, async (req, res) => {
  const getPortfolio = `SELECT * FROM portfolio ORDER BY id DESC`

  try {
    const { rows } = await dbQuery.query(getPortfolio)
    const dbResponse = rows
    if (dbResponse[0] === undefined) {
      errorMessage.error = 'There are no profolio'
      return res.status(status.bad).send(errorMessage)
    }
    successMessage.data = dbResponse
    return res.status(status.success).send(successMessage)
  } catch (error) {
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
