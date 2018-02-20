const Transaction = require('../../models/transaction.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    Transaction.find({}).exec(function (err, documents) {
      if (err) {
        return next(err)
      }
      return res.status(200).json(documents)
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
