const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const moment = require('moment')

const dbQuery = require('../db/dbQuery')

const checkUserInSQL = async email => {
  console.log(email)
  const loginUserQuery = 'SELECT * FROM users WHERE email = $1'
  try {
    const { rows } = await dbQuery.query(loginUserQuery, [email])
    const dbResponse = rows[0]
    if (!dbResponse) {
      return null
    }
    return dbResponse
  } catch (error) {
    return console.log('error')
  }
}

const createUser = async (name, email, hashedPassword, createdTime) => {
  const createUserQuery = `INSERT INTO
    users(
      name ,
      email,
      password,
      createdTime)
    VALUES($1, $2, $3, $4)
    returning *`

  const values = [name, email, hashedPassword, createdTime]

  try {
    const { rows } = await dbQuery.query(createUserQuery, values)
    const dbResponse = rows[0]
    delete dbResponse.password
    return dbResponse
  } catch (error) {
    return error
  }
}

module.exports = passport => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['displayName', 'email'],
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        console.log(req)
        checkUserInSQL({ email: profile._json.email })
          .then(user => {
            console.log(user)
            if (user) {
              return done(null, user)
            }
            const randomPassword = Math.random()
              .toString(36)
              .slice(-8)
            bcrypt.genSalt(10, (error, salt) => {
              // eslint-disable-next-line no-shadow
              bcrypt.hash(randomPassword, salt, (err, hash) => {
                if (err) {
                  throw err
                }
                createUser({
                  name: profile._json.name,
                  email: profile._json.email,
                  password: hash,
                  createdTime: moment(new Date())
                })
              })
            })
          })
          .catch(err =>
            done(err, false, req.flash('fail_msg', 'Facebook 驗證失敗'))
          )
      }
    )
  )

  const findUserId = async id => {
    const loginUserQuery = 'SELECT * FROM users WHERE id = $1'
    try {
      const { rows } = await dbQuery.query(loginUserQuery, [id])
      const dbResponse = rows[0]
      if (!dbResponse) {
        return console.log('cant find this id')
      }
      return id
    } catch (error) {
      return console.log('error')
    }
  }
  // serialize user instance to the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // deserialize user instance from the session
  passport.deserializeUser((id, done) => {
    findUserId(id, (err, user) => {
      done(err, user)
    })
  })
}
