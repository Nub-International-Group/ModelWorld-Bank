const Account = require('../../models/account.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}).populate('wages').exec(function (err, document) {
    if (err) {
      return next(err)
    }

    if (document == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if (req.decoded.admin === true) { // Permission level greater than 1 or they are admin
      document.payWages(function (err) {
        if (err) {
          return next(err)
        }
        return res.status(200).json({})
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
