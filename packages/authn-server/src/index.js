const express = require('express')
const session = require('express-session')
const config = require('config')
const RedditStrategy = require('passport-reddit').Strategy
const passport = require('passport')
const jwt = require('jsonwebtoken')
const app = express()

app.use(session({
  secret: config.get('secret')
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

passport.use(new RedditStrategy({
  callbackURL: config.get('deploymentURL') + '/v1/auth/callback',
  clientID: config.get('reddit.key'),
  clientSecret: config.get('reddit.secret')
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    // no user stored in the database so just pass profile through
    return done(null, profile)
  })
}))

app.use(passport.initialize())
app.use(passport.session())

/**
 * gets the redirect url and sends it to the client which will then redirect
 */
app.get('/v1/auth', (req, res, next) => {
  const opts = {
    state: 'test'
  }

  passport.authenticate('reddit', opts)(req, res, next)
})

/**
 * handles the return from the reddit site
 */
app.get('/v1/auth/callback', (req, res, next) => {
  passport.authenticate('reddit', {
    failureRedirect: config.get('clientURL') + '/#/login',
    successRedirect: config.get('clientURL') + '/#/login/success'
  })(req, res, next)
})

const admins = [
  'strideynet',
  'padanub',
  'ohprkl'
]

/**
 * handles the client requesting a JWT
 */
app.get('/v1/auth/jwt', (req, res, next) => {
  if (req.isAuthenticated()) {
    if (!req.user.name) {
      throw new Error('missing user name')
    }

    jwt.sign({
      admin: admins.includes(req.user.name.toLowerCase()),
      name: req.user.name.toLowerCase()
    }, config.get('secret'), (err, jwtString) => {
      if (err) { return next(err) }

      res.status(200).json({ jwt: jwtString })

      req.session && req.session.destroy(() => {}) // terminate the login and user. JWT then becomes the soul form of session.
      req.user = undefined
    })
  }
})

app.listen(8383)
