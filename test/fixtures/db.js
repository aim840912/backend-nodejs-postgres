const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
// const shortId = require('short-id')
const User = require('../../src/models/user')
// const SUrl = require('../../src/models/shorturl')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: 'mdiwkwwdw',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Jess',
  email: 'jess@example.com',
  password: 'myhouse099@@',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
}

// const urlOneId = new mongoose.Types.ObjectId()
// const urlOne = {
//   _id: urlOneId,
//   url_name: 'https://www.facebook.com/',
//   owner: userOneId,
//   shortUrl: '/surl/123456'
// }

const setupDatabase = async () => {
  await User.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  // await SUrl.deleteMany()
  // await new SUrl(urlOne).save()
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDatabase
  // urlOneId,
  // urlOne
}
