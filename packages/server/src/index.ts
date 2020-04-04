import * as bodyParser from 'body-parser'
import * as config from 'config'
import * as cors from 'cors'
import * as express from 'express'
import * as session from 'express-session'
import * as jwt from 'jsonwebtoken'
import * as mongoose from 'mongoose'
import * as passport from 'passport'
import * as pino from 'pino'

import * as middleware from './middleware'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  name: 'server-entrypoint'
})

const controllers = require('./controllers')

const MongoStore = require('connect-mongo')(session)
const RedditStrategy = require('passport-reddit').Strategy

const pfile = require('./package')

// establish database connection
mongoose.connect(config.get('mongoURL'))
mongoose.connection.on('error', (err: Error) => {
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
  secret: config.get('secret'),
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// set custom headers
app.use((req, res, next) => {
  res.contentType('application/json')
  res.setHeader('X-Powered-By', 'The dreams and salt of MHOC')
  next()
})

/*
 * we don't persist user details so both of these passport methods are empty.
 * TODO: Strip out passport and just directly interact with the Reddit API
 */
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
}, (accessToken: any, refreshToken: any, profile: any, done: any) => {
  process.nextTick(() => {
    // no user stored in the database so just pass profile through
    return done(null, profile)
  })
}))

app.use(passport.initialize())
app.use(passport.session())

/**
 * endpoints Begin
 */

/**
 * health Endpoint. Sends 200 if up
 */
app.get('/v1/healthz', (req, res) => {
  res.status(200).json({ memory: process.memoryUsage(), time: new Date(), uptime: process.uptime(), version: pfile.version })
})

/**
 * auth Endpoints Begin
 */
app.get('/v1/users/me/accounts', middleware.ensureJWT, require('./controllers/account/user-accounts.js'))

app.use('/v1/accounts', middleware.ensureJWT, controllers.account.router)
app.use('/v1/account-types', middleware.ensureJWT, controllers.accountType.router)
app.use('/v1/bets', middleware.ensureJWT, controllers.bet.router)
app.use('/v1/properties', middleware.ensureJWT, controllers.property.router)
app.use('/v1/requests', middleware.ensureJWT, controllers.request.router)
app.use('/v1/settings', middleware.ensureJWT, controllers.setting.router)
app.use('/v1/transactions', middleware.ensureJWT, controllers.transaction.router)
app.use('/v1/wages', middleware.ensureJWT, controllers.wage.router)
app.use('/v1/wagers', middleware.ensureJWT, controllers.wager.router)

const admins = [
  'strideynet',
  'padanub',
  'ohprkl'
]

/**
 * gets the redirect url and sends it to the client which will then redirect
 */
app.get('/v1/auth', (req, res, next) => {
  const opts: passport.AuthenticateOptions = {
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

/**
 * handles the client requesting a JWT
 */
app.get('/v1/auth/jwt', middleware.ensureAuthenticated, (req, res, next) => {
  if (!req.user) {
    throw new Error('missing user field')
  }

  jwt.sign({
    admin: admins.includes(req.user.name.toLowerCase()),
    name: req.user.name.toLowerCase()
  }, config.get('secret'), (err: Error, jwtString: string) => {
    if (err) { return next(err) }

    res.status(200).json({ jwt: jwtString })

    req.session && req.session.destroy(() => {}) // terminate the login and user. JWT then becomes the soul form of session.
    req.user = undefined
  })
})

/**
 * 404 Handler
 */
app.use((req, res, next) => {
  res.status(404).json({ err: { code: 404, desc: 'Resource not found' } })
})

/**
 * error Handler
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!err.code) err.code = 500

  logger.error(err)
  if (err.code === 500) {
    logger.error({
      body: req.body,
      err,
      method: req.method,
      query: req.query,
      url: req.originalUrl
    }, 'error handling request')

    err.message = 'SERVER_ERROR'
  }

  res.status(err.code).json({ err: { code: err.code, desc: err.message } })
})

app.listen(process.env.PORT || 4040)
