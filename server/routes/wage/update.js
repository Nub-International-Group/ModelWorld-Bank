const wage = require('../../models/wage.js')

module.exports = function (req, res, next) {
  wage.findOne({'_id': req.params.id}).exec(function (err, document) {
    if (err) {
      return next(err)
    }

    if (document == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    return res.status(200).json(document)
  })
}
