import * as bodyParser from 'body-parser'
import * as config from 'config'
import * as cors from 'cors'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import * as mongoose from 'mongoose'
import * as pino from 'pino'

import * as middleware from './middleware'
import { HttpError } from 'http-errors'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  name: 'server-entrypoint'
})

const controllers = require('./controllers')
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

// set custom headers
app.use((req, res, next) => {
  res.contentType('application/json')
  res.setHeader('X-Powered-By', 'The dreams and salt of MHOC')
  next()
})

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

/**
 * 404 Handler
 */
app.use((req, res, next) => {
  res.status(404).json({ err: { code: 404, desc: 'Resource not found' } })
})

/**
 * error Handler
 */
app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!err.statusCode) err.statusCode = 500

  logger.error(err)
  if (err.statusCode === 500) {
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
