/* eslint-disable jest/expect-expect */
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')
const index = require('../src/index')

beforeEach(setupDatabase)

afterAll(async () => {
  await index.listener.close()
})

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/user/signup')
    .send({
      name: 'Andrew',
      email: 'andrew@example.com',
      password: 'werrrwrwrw'
    })
    .expect(201)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: 'Andrew',
      email: 'andrew@example.com'
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('werrrwrwrw')
})

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/user/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200)
  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/user/login')
    .send({
      email: userOne.email,
      password: 'thisisnotmypass'
    })
    .expect(400)
})
