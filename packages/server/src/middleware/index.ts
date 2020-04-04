import * as express from 'express'
import createHttpError = require('http-errors')

const jwt = require('jsonwebtoken')
const config = require('config')

export const ensureAuthenticated: express.Handler = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.status(401).json({ err: { code: 401, desc: 'Not logged in' } })
}

export const ensureJWT: express.Handler = (req, res, next) => {
  if (req.headers.jwt) {
    jwt.verify(req.headers.jwt, config.secret, (err: Error, decoded: any) => {
      if (err) {
        return res.status(401).json({ err: { code: 401, desc: 'Not logged in' } })
      }
      req.decoded = decoded
      next()
    })
  } else {
    res.status(401).json({ err: { code: 401, desc: 'Not logged in' } })
  }
}

export const ensureAdmin: express.Handler = (req, res, next) => {
  if (req.decoded.admin) {
    return next()
  }

  next(createHttpError(403, 'You need higher privileges to complete this action.'))
}
