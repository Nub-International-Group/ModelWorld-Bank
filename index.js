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
  callbackURL: config.deploymentURL + '/api/auth/return'
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
app.get('/api/health', function (req, res, next) {
  res.status(200).json({time: new Date(), uptime: process.uptime(), memory: process.memoryUsage(), version: pfile.version})
})

/**
 * Auth Endpoints Begin
 */
app.get('/api/account', ensureJWT, require('./routes/account/root.js'))
app.get('/api/account/public', ensureJWT, require('./routes/account/public.js'))
app.get('/api/account/admin', ensureJWT, require('./routes/account/admin.js'))
app.post('/api/account', ensureJWT, require('./routes/account/new.js'))

app.get('/api/account/id/:id', ensureJWT, require('./routes/account/individual.js'))
app.delete('/api/account/id/:id', ensureJWT, require('./routes/account/delete.js'))
app.post('/api/account/id/:id/user', ensureJWT, require('./routes/account/user/new.js'))
app.put('/api/account/id/:id', ensureJWT, require('./routes/account/update.js'))

app.get('/api/account/id/:id/wage', ensureJWT, require('./routes/account/wage/root.js'))
app.post('/api/account/id/:id/wage', ensureJWT, require('./routes/account/wage/new.js'))
app.delete('/api/account/id/:id/wage/:wageID', ensureJWT, require('./routes/account/wage/delete.js'))
app.get('/api/account/id/:id/pay', ensureJWT, require('./routes/account/pay.js'))

app.get('/api/account/typeahead', require('./routes/account/typeahead.js'))

app.get('/api/account/id/:id/transaction', ensureJWT, require('./routes/account/transaction/root.js'))
app.post('/api/account/id/:id/transaction', ensureJWT, require('./routes/account/transaction/new.js'))
app.get('/api/transaction', ensureJWT, require('./routes/transaction/root.js'))
app.delete('/api/transaction/id/:id', ensureJWT, require('./routes/transaction/delete.js'))

app.get('/api/request', ensureJWT, require('./routes/request/root.js'))
app.post('/api/request/id/:id', ensureJWT, require('./routes/request/update.js'))
app.post('/api/request/all', ensureJWT, require('./routes/request/all.js'))

app.get('/api/wage', ensureJWT, require('./routes/wage/root.js'))
app.put('/api/wage/id/:id', ensureJWT, require('./routes/wage/update.js'))
app.delete('/api/wage/id/:id', ensureJWT, require('./routes/wage/delete.js'))
app.post('/api/wage', ensureJWT, require('./routes/wage/new.js'))
app.post('/api/wage/purge', ensureJWT, require('./routes/wage/purge.js')) // Handles post GE wipe of wages

app.get('/api/bet', ensureJWT, require('./routes/bet/root.js'))
app.post('/api/bet', ensureJWT, require('./routes/bet/new.js'))
app.put('/api/bet/id/:id/status', ensureJWT, require('./routes/bet/status.js'))

app.get('/api/wager/account/:id', ensureJWT, require('./routes/wager/byaccount.js'))
app.get('/api/wager/bet/:id', ensureJWT, require('./routes/wager/bybet.js'))
app.post('/api/wager', ensureJWT, require('./routes/wager/new.js'))

let admins = [
  'strideynet',
  'padanub'
]

 /**
  * Gets the redirect url and sends it to the client which will then redirect
  */
app.get('/api/auth/login', function (req, res, next) {
  passport.authenticate('reddit', {
    state: 'test',
    duration: 'permanent'
  })(req, res, next)
})

/**
 * Handles the return from the reddit site
 */
app.get('/api/auth/return', function (req, res, next) {
  passport.authenticate('reddit', {
    successRedirect: config.clientURL + '/#/login/success',
    failureRedirect: config.clientURL + '/#/login'
  })(req, res, next)
})

/**
 * Handles the client requesting a JWT
 */
app.get('/api/auth/jwt', ensureAuthenticated, function (req, res, next) {
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
  res.status(500).json({err: {code: 500, desc: err.message}})
  console.log(err)
})

app.listen(process.env.PORT || 8080)
