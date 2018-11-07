const Transaction = require('../../models/transaction.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    Transaction.remove({'_id': req.params.id}, function (err) {
      if (err) {
        return next(err)
      }

      return require('./root.js')(req, res, next) // Returns document with updated data
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
