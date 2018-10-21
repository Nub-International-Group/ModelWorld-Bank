const Account = require('../../../models/account.js')
const Transaction = require('../../../models/transaction.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}, function (err, sendingAccount) {
    if (err) {
      return next(err)
    }

    if (sendingAccount == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if (['GBP', 'USD'].includes(req.body.currency) === false) {
      return res.status(500).json({err: {code: 500, desc: 'Invalid currency'}})
    }

    if ((sendingAccount.users[req.decoded.name] === 3) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      Account.findOne({'_id': req.body.target}, function (err, targetAccount) {
        if (err) {
          return next(err)
        }

        if (sendingAccount == null) {
          return res.status(404).json({err: {code: 404, desc: 'Target not found'}})
        }

        let amount = Number(req.body.amount)

        if (isNaN(amount)) {
          return res.status(500).json({err: {code: 500, desc: 'Invalid amount'}})
        }

        if (amount <= 0) {
          return res.status(500).json({err: {code: 500, desc: 'Don\'t be silly'}})
        }

        sendingAccount.calculateBalance(function (err, data) {
          if (err) {
            return next(err)
          }

          if (data.balance[req.body.currency]) {
            if (data.balance[req.body.currency] >= amount || sendingAccount._id === '*economy*') {
              let transaction = new Transaction({
                from: sendingAccount._id,
                to: targetAccount._id,
                amount: amount,
                currency: req.body.currency,
                description: req.body.description,
                authoriser: req.decoded.name
              })

              transaction.save(function (err) {
                if (err) {
                  return next(err)
                }

                return res.status(200).json({})
              })
            } else {
              return res.status(500).json({err: {code: 500, desc: 'Not enough balance'}})
            }
          } else {
            return res.status(500).json({err: {code: 500, desc: 'No balance in currency'}})
          }
        })
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
