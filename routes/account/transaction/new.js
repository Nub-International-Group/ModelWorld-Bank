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

    req.body.currency = 'GBP'
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

        sendingAccount.calculateBalance().then((data) => {
          if (data.balance[req.body.currency] || sendingAccount._id === '*economy*') {
            if (data.balance[req.body.currency] >= (amount + 10) || sendingAccount._id === '*economy*') {
              let transactions = [{
                from: sendingAccount._id,
                to: targetAccount._id,
                amount: amount,
                currency: req.body.currency,
                description: req.body.description,
                authoriser: req.decoded.name
              }, {
                from: sendingAccount._id,
                to: 'SJS4nVQLG',
                amount: 10,
                currency: req.body.currency,
                description: 'Tx Fee',
                authoriser: req.decoded.name
              }]


              return Transaction.insertMany(transactions)
            } else {
              throw new Error('Not enough balance')
            }
          } else {
            throw new Error('No balance in currency')
          }
        }).then(() => res.status(200).json({})).catch(next)
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
