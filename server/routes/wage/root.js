const wage = require('../../models/wage.js')

module.exports = function (req, res, next) {
  wage.find({}).exec(function (err, documents) {
    if (err) {
      return next(err)
    }

    if (documents.length === 0) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    return res.status(200).json(documents)
  })
}
