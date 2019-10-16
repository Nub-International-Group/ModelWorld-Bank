const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('config')
const session = require('express-session')
const jwt = require('jsonwebtoken')

const MongoStore = require('connect-mongo')(session)
const RedditStrategy = require('passport-reddit').Strategy

const pfile = require('./package')

mongoose.connect(config.mongoURL)
mongoose.Promise = Promise

mongoose.connection.on('error', function (err) {
  console.log('DB Connection Error')
  console.log(err)

  process.exit()
})

const app = express()
app.use(cors({credentials: true, origin: ['https://bank.nub.international', 'http://127.0.0.1:8080']}))
app.options('*', cors({credentials: true, origin: ['https://bank.nub.international', 'http://127.0.0.1:8080']}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// sessions are only used for the authentication pathway. JWTs are usually used instead.
app.use(session({
  secret: config.secret,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

/**
 * All responses should be JSON unless otherwise mentioned
 */
app.use(function (req, res, next) {
  res.contentType('application/json')
  res.setHeader('X-Powered-By', 'The dreams and salt of MHOC')
  next()
})

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(new RedditStrategy({
  clientID: config.reddit.key,
  clientSecret: config.reddit.secret,
  callbackURL: config.deploymentURL + '/v1/auth/callback'
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    // TODO: Grab extended user from the DATABASE
    return done(null, profile)
  })
}))

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.status(401).json({err: {code: 401, desc: 'Not logged in'}})
}

function ensureJWT (req, res, next) {
  if (req.headers.jwt) {
    jwt.verify(req.headers.jwt, config.secret, function (err, decoded) {
      if (err) {
        return res.status(401).json({err: {code: 401, desc: 'Not logged in'}})
      }
      req.decoded = decoded
      next()
    })
  } else {
    res.status(401).json({err: {code: 401, desc: 'Not logged in'}})
  }
}
app.use(passport.initialize())
app.use(passport.session())

/**
 * Endpoints Begin
 */

/**
 * Health Endpoint. Sends 200 if up
 */
app.get('/v1/healthz', function (req, res, next) {
  res.status(200).json({time: new Date(), uptime: process.uptime(), memory: process.memoryUsage(), version: pfile.version})
})

/**
 * Auth Endpoints Begin
 */
app.get('/v1/users/me/accounts', ensureJWT, require('./routes/account/user-accounts.js'))

app.get('/v1/accounts', ensureJWT, require('./routes/account/root.js'))
app.post('/v1/accounts', ensureJWT, require('./routes/account/new.js'))

app.get('/v1/accounts/:id', ensureJWT, require('./routes/account/individual.js'))
app.delete('/v1/accounts/:id', ensureJWT, require('./routes/account/delete.js'))
app.put('/v1/accounts/:id', ensureJWT, require('./routes/account/update.js'))

app.post('/v1/accounts/:id/users', ensureJWT, require('./routes/account/user/new.js'))

app.get('/v1/accounts/:id/wages', ensureJWT, require('./routes/account/wage/root.js'))
app.post('/v1/accounts/:id/wages', ensureJWT, require('./routes/account/wage/new.js'))
app.delete('/v1/accounts/:id/wages/:wageID', ensureJWT, require('./routes/account/wage/delete.js'))
app.get('/v1/accounts/:id/pay', ensureJWT, require('./routes/account/pay.js'))

app.get('/v1/accounts/:id/transactions', ensureJWT, require('./routes/account/transaction/root.js'))
app.post('/v1/accounts/:id/transactions', ensureJWT, require('./routes/account/transaction/new.js'))

app.get('/v1/accounts/:id/wagers', ensureJWT, require('./routes/wager/byaccount.js'))

app.get('/v1/transactions', ensureJWT, require('./routes/transaction/root.js'))
app.delete('/v1/transactions/:id', ensureJWT, require('./routes/transaction/delete.js'))

app.get('/v1/requests', ensureJWT, require('./routes/request/root.js'))
app.post('/v1/request/:id', ensureJWT, require('./routes/request/update.js'))

app.get('/v1/wages', ensureJWT, require('./routes/wage/root.js'))
app.put('/v1/wages/:id', ensureJWT, require('./routes/wage/update.js'))
app.delete('/v1/wages/:id', ensureJWT, require('./routes/wage/delete.js'))
app.post('/v1/wages', ensureJWT, require('./routes/wage/new.js'))
app.post('/v1/wages/purge', ensureJWT, require('./routes/wage/purge.js')) // Handles post GE wipe of wages

app.get('/v1/bets', ensureJWT, require('./routes/bet/root.js'))
app.post('/v1/bets', ensureJWT, require('./routes/bet/new.js'))
app.put('/v1/bets/:id/status', ensureJWT, require('./routes/bet/status.js'))

app.get('/v1/wagers/bet/:id', ensureJWT, require('./routes/wager/bybet.js'))
app.post('/v1/wagers', ensureJWT, require('./routes/wager/new.js'))

const admins = [
  'strideynet',
  'padanub',
  'ohprkl'
]

 /**
  * Gets the redirect url and sends it to the client which will then redirect
  */
app.get('/v1/auth', function (req, res, next) {
  passport.authenticate('reddit', {
    state: 'test',
    duration: 'permanent'
  })(req, res, next)
})

/**
 * Handles the return from the reddit site
 */
app.get('/v1/auth/callback', function (req, res, next) {
  passport.authenticate('reddit', {
    successRedirect: config.clientURL + '/#/login/success',
    failureRedirect: config.clientURL + '/#/login'
  })(req, res, next)
})

/**
 * Handles the client requesting a JWT
 */
app.get('/v1/auth/jwt', ensureAuthenticated, function (req, res, next) {
  jwt.sign({
    name: req.user.name.toLowerCase(),
    admin: admins.includes(req.user.name.toLowerCase())
  }, config.secret, function (err, jwtString) {
    if (err) { return next(err) }

    res.status(200).json({'jwt': jwtString})

    req.session.destroy() // Terminate the login and user. JWT then becomes the soul form of session.
    req.user = null
  })
})

/**
 * 404 Handler
 */
app.use(function (req, res, next) {
  res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
})

/**
 * Error Handler
 */
app.use(function (err, req, res, next) {
  if (!err.code) err.code = 500

  if (err.code === 500) {
    console.log('an error occurred handling a request:')
    console.log(err)

    err.message = 'Something went wrong! Blame nub...'
  }

  res.status(err.code).json({err: {code: err.code, desc: err.message}})

})

app.listen(process.env.PORT || 8080)
