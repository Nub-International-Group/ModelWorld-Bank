const wage = require('../../models/wage.js')

module.exports = function (req, res, next) {
  wage.find({}).exec(function (err, documents) {
    if (err) {
      return next(err)
    }

    return res.status(200).json(documents)
  })
}
