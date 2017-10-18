const wage = require('../../models/wage.js')
const wageRoot = require('./root.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    wage.remove({'_id': req.params.id}, function (err) {
      if (err) {
        return next(err)
      }

      return wageRoot(req, res, next) // Returns document with updated data
    })
  }
}
