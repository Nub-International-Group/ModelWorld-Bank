const Wager = require('../../models/wager.js')
const Account = require('../../models/account.js')
const Transaction = require('../../models/transaction.js')
const Bet = require('../../models/bet.js')

module.exports = function (req, res, next) {
  Promise.all([ Account.findOne({_id: req.body.target}).exec(), Bet.findOne({_id: req.body.bet}).exec()]).then((values) => {
    let account = values[0]
    let bet = values[1]

    let amount = parseFloat(req.body.amount)

    if (!(account && bet)) {
      throw new Error('Invalid references.')
    }

    if (isNaN(amount)) {
      throw new Error('Invalid amount, cannot cast.')
    }

    if (amount <= 0) {
      throw new Error('Invalid amount, you can\'t bet nothing.')
    }

    if (bet.status != 1) {
      throw new Error('Bet is closed or paid out.')
    }

    if (account.users[req.decoded.name] >= 2) {
      let option = bet.options.id(req.body.option)

      account.calculateBalance((err, data) => {
        if (data['balance']['GBP'] >= req.body.amount) {
          if (option) {
            let newWager = new Wager({
              amount: req.body.amount,
              currency: 'GBP',
              bet: bet._id,
              account: account._id,
              betOption: option._id,
              odd: option.currentOdds
            })

            let newTransaction = new Transaction({
              from: account._id,
              to: '*NubBets*',
              amount: req.body.amount,
              currency: 'GBP',
              description: 'Payment for Bet',
              authoriser: 'SYSTEM'
            })

            return newTransaction.save((err) => {
              if (err) {
                throw err
              }

              newWager.save((err) => {
                if (err) {
                  throw err
                }

                res.status(200).json({})
              })
            })
          } else {
            throw new Error('Invalid option')
          }
        } else {
          throw new Error('Not enough balance')
        }
      })
    } else {
      throw new Error('Incorrect permissions')
    }
  }).catch((err) => {
    console.log(err)
    return res.status(500).json({err: {code: 500, desc: 'Something went wrong.'}})
  })
}
