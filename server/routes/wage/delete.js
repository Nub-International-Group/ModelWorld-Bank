const wage = require('../../models/wage.js')
const wageRequest = require('../../models/wageRequest.js')
const wageRoot = require('./root.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    wage.remove({'_id': req.params.id}, function (err) {
      if (err) {
        return next(err)
      }
      wageRequest.remove({'wage': req.params.id}, function (err) {
        if (err) {
          return next(err)
        }

        return wageRoot(req, res, next) // Returns document with updated data
      })
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
