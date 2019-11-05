const jwt = require('jsonwebtoken')
const config = require('config')

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.status(401).json({ err: { code: 401, desc: 'Not logged in' } })
}

const ensureJWT = (req, res, next) => {
  if (req.headers.jwt) {
    jwt.verify(req.headers.jwt, config.secret, function (err, decoded) {
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

const ensureAdmin = (req, res, next) => {
  if (req.decoded.admin) {
    return next()
  }

  const err = new Error('You need higher privileges to complete this action.')
  err.code = 403

  next(err)
}

module.exports = {
  ensureAuthenticated,
  ensureJWT,
  ensureAdmin
}
