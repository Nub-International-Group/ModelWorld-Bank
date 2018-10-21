const wage = require('../../models/wage.js')
const wageRoot = require('./root.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    req.body.newDocument.value = Number(req.body.newDocument.value)

    if (isNaN(req.body.newDocument.value)) {
      return next(new Error('Invalid Data Entry'))
    }

    wage.create(req.body.newDocument, function (err, document) {
      if (err) {
        return next(err)
      }

      return wageRoot(req, res, next) // Returns document with updated data
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
