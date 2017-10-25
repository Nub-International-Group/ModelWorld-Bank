const Account = require('../../../models/account.js')
const Transaction = require('../../../models/transaction.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}).exec(function (err, account) {
    if (err) {
      return next(err)
    }

    if (account == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if ((account.users[req.decoded.name] >= 1) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      Transaction.find({to: account._id}).populate('from').exec(function (err, toTransactions) {
        if (err) {
          return next(err)
        }
        Transaction.find({from: account._id}).populate('to').exec(function (err, fromTransactions) {
          if (err) {
            return next(err)
          }

          let combinedTransactions = []

          if (fromTransactions === null) {
            combinedTransactions = toTransactions
          } else if (toTransactions === null) {
            combinedTransactions = fromTransactions
          } else {
            combinedTransactions = toTransactions.concat(fromTransactions)
          }

          return res.status(200).json(combinedTransactions)
        })
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
