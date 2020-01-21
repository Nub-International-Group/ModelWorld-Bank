const express = require('express')
const cors = require('cors')
const middleware = require('./middleware')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('config')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const logger = require('pino')({
  name: 'payment-cron',
  level: process.env.LOG_LEVEL || 'info'
})

const controllers = require('./controllers')

const MongoStore = require('connect-mongo')(session)
const RedditStrategy = require('passport-reddit').Strategy

const pfile = require('./package')

// establish database connection
mongoose.connect(config.mongoURL)
mongoose.Promise = Promise
mongoose.connection.on('error', (err) => {
  logger.fatal(err, 'DB Connection Error')
  process.exit()
})

const app = express()

// cors middleware
const corsInstance = cors({ credentials: true, origin: ['https://bank.nub.international', 'http://localhost:8080'] })
app.use(corsInstance)
app.options('*', corsInstance)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// sessions are only used for the authentication pathway. JWTs are usually used instead.
app.use(session({
  secret: config.secret,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// set custom headers
app.use((req, res, next) => {
  res.contentType('application/json')
  res.setHeader('X-Powered-By', 'The dreams and salt of MHOC')
  next()
})

// we don't persist user details so both of these passport methods are empty.
// TODO: Strip out passport and just directly interact with the Reddit API
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

passport.use(new RedditStrategy({
  clientID: config.reddit.key,
  clientSecret: config.reddit.secret,
  callbackURL: config.deploymentURL + '/v1/auth/callback'
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    // No user stored in the database so just pass profile through
    return done(null, profile)
  })
}))

app.use(passport.initialize())
app.use(passport.session())

/**
 * Endpoints Begin
 */

/**
 * Health Endpoint. Sends 200 if up
 */
app.get('/v1/healthz', (req, res) => {
  res.status(200).json({ time: new Date(), uptime: process.uptime(), memory: process.memoryUsage(), version: pfile.version })
})

/**
 * Auth Endpoints Begin
 */
app.get('/v1/users/me/accounts', middleware.ensureJWT, require('./controllers/account/user-accounts.js'))

app.use('/v1/accounts', middleware.ensureJWT, controllers.account.router)
app.use('/v1/account-types', middleware.ensureJWT, controllers.accountType.router)
app.use('/v1/bets', middleware.ensureJWT, controllers.bet.router)
app.use('/v1/properties', middleware.ensureJWT, controllers.property.router)
app.use('/v1/requests', middleware.ensureJWT, controllers.request.router)
app.use('/v1/transactions', middleware.ensureJWT, controllers.transaction.router)
app.use('/v1/wages', middleware.ensureJWT, controllers.wage.router)
app.use('/v1/wagers', middleware.ensureJWT, controllers.wager.router)

const admins = [
  'strideynet',
  'padanub',
  'ohprkl'
]

/**
  * Gets the redirect url and sends it to the client which will then redirect
  */
app.get('/v1/auth', (req, res, next) => {
  passport.authenticate('reddit', {
    state: 'test',
    duration: 'permanent'
  })(req, res, next)
})

/**
 * Handles the return from the reddit site
 */
app.get('/v1/auth/callback', (req, res, next) => {
  passport.authenticate('reddit', {
    successRedirect: config.clientURL + '/#/login/success',
    failureRedirect: config.clientURL + '/#/login'
  })(req, res, next)
})

/**
 * Handles the client requesting a JWT
 */
app.get('/v1/auth/jwt', middleware.ensureAuthenticated, (req, res, next) => {
  jwt.sign({
    name: req.user.name.toLowerCase(),
    admin: admins.includes(req.user.name.toLowerCase())
  }, config.secret, function (err, jwtString) {
    if (err) { return next(err) }

    res.status(200).json({ jwt: jwtString })

    req.session.destroy() // Terminate the login and user. JWT then becomes the soul form of session.
    req.user = null
  })
})

/**
 * 404 Handler
 */
app.use((req, res, next) => {
  res.status(404).json({ err: { code: 404, desc: 'Resource not found' } })
})

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  if (!err.code) err.code = 500

  if (err.code === 500) {
    logger.err({
      err,
      body: req.body,
      query: req.query,
      method: req.method,
      url: req.originalUrl
    }, 'error handling request')

    err.message = 'SERVER_ERROR'
  }

  res.status(err.code).json({ err: { code: err.code, desc: err.message } })
})

app.listen(process.env.PORT || 4040)
