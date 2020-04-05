import * as config from 'config'
import * as express from 'express'
import { CreateHttpError } from 'http-errors'
import * as jwt from 'jsonwebtoken'

import { IRequest } from '../types'

export const ensureJWT: express.Handler = (req: IRequest, res, next) => {
  if (req.headers.jwt && typeof req.headers.jwt === 'string') {
    jwt.verify(req.headers.jwt, config.get('secret'), (err: Error, decoded: any) => {
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

export const ensureAdmin: express.Handler = (req: IRequest, res, next) => {
  if (req.decoded.admin) {
    return next()
  }

  next(CreateHttpError(403, 'You need higher privileges to complete this action.'))
}
