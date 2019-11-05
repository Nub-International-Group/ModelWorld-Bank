const express = require('express')
const cors = require('cors')
const middleware = require('./middleware')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('config')
const session = require('express-session')
const jwt = require('jsonwebtoken')

const controllers = require('./controllers/index.js')

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

app.use(cors({ credentials: true, origin: ['https://bank.nub.international', 'http://localhost:8080'] }))
app.options('*', cors({ credentials: true, origin: ['https://bank.nub.international', 'http://localhost:8080'] }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// sessions are only used for the authentication pathway. JWTs are usually used instead.
app.use(session({
  secret: config.secret,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

/**
 * All responses should be JSON unless otherwise mentioned
 */
app.use( (req, res, next) => {
  res.contentType('application/json')
  res.setHeader('X-Powered-By', 'The dreams and salt of MHOC')
  next()
})

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
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(() => {
    // TODO: Grab extended user from the DATABASE
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
app.get('/v1/healthz', (req, res, next) => {
  res.status(200).json({ time: new Date(), uptime: process.uptime(), memory: process.memoryUsage(), version: pfile.version })
})

/**
 * Auth Endpoints Begin
 */
app.get('/v1/users/me/accounts', middleware.ensureJWT, require('./controllers/account/user-accounts.js'))

app.get('/v1/accounts', middleware.ensureJWT, require('./controllers/account/root.js'))
app.post('/v1/accounts', middleware.ensureJWT, require('./controllers/account/new.js'))

app.get('/v1/accounts/:id', middleware.ensureJWT, require('./controllers/account/individual.js'))
app.delete('/v1/accounts/:id', middleware.ensureJWT, middleware.ensureAdmin, require('./controllers/account/delete.js'))
app.put('/v1/accounts/:id', middleware.ensureJWT, require('./controllers/account/update.js'))

app.post('/v1/accounts/:id/users', middleware.ensureJWT, require('./controllers/account/user/new.js'))

app.get('/v1/accounts/:id/wages', middleware.ensureJWT, require('./controllers/account/wage/root.js'))
app.post('/v1/accounts/:id/wages', middleware.ensureJWT, require('./controllers/account/wage/new.js'))
app.delete('/v1/accounts/:id/wages/:wageID', middleware.ensureJWT, require('./controllers/account/wage/delete.js'))
app.get('/v1/accounts/:id/pay', middleware.ensureJWT, require('./controllers/account/pay.js'))

app.get('/v1/accounts/:id/transactions', middleware.ensureJWT, require('./controllers/account/transaction/root.js'))
app.post('/v1/accounts/:id/transactions', middleware.ensureJWT, require('./controllers/account/transaction/new.js'))

app.get('/v1/accounts/:id/wagers', middleware.ensureJWT, controllers.wager.findByAccount)ß

app.use('/v1/accounts', middleware.ensureJWT, controllers.account.router)
app.use('/v1/bets', middleware.ensureJWT, controllers.bet.router)
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
    console.log('an error occurred handling a request:')
    console.log(err)

    err.message = 'Something went wrong! Blame nub...'
  }

  res.status(err.code).json({ err: { code: err.code, desc: err.message } })
})

app.listen(process.env.PORT || 4040)
