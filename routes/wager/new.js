const Wager = require('../../models/wager.js')
const Account = require('../../models/account.js')
const Transaction = require('../../models/transaction.js')
const Bet = require('../../models/bet.js')

module.exports = function (req, res, next) {
  Promise.all([ Account.findOne({_id: req.body.target}).exec(), Bet.findOne({_id: req.body.bet}).exec()]).then((values) => {
    let account = values[0]
    let bet = values[1]
    
    let amount = Number(req.body.amount)
    if (!(account && bet)) {
      throw new Error('Invalid references.')
    }

    if (isNaN(amount)) {
      throw new Error('Invalid amount, cannot cast.')
    }

    if (amount <= 0) {
      throw new Error('Invalid amount, you can\'t bet nothing.')
    }

    if (amount > 1000000) {
      throw new Error('Invalid amount, you can only bet up to 1,000,000')
    }

    if (bet.status != 1) {
      throw new Error('Bet is closed or paid out.')
    }

    if (account.users[req.decoded.name] < 2) {
      throw new Error('Incorrect permissions.')
    }

    let option = bet.options.id(req.body.option)

    return account.calculateBalance().then((data) => {
      if (!data['balance']['GBP']) {
        throw new Error('No balance.')
      }

      if (data['balance']['GBP'] < amount) {
        throw new Error('Not enough balance.')
      }

      if (!option) {
        throw new Error('Invalid option.')
      }

      let newWager = new Wager({
        amount: amount,
        currency: 'GBP',
        bet: bet._id,
        account: account._id,
        betOption: option._id,
        odd: option.currentOdds
      })

      let newTransaction = new Transaction({
        from: account._id,
        to: '*NubBets*',
        amount: amount,
        currency: 'GBP',
        description: 'Payment for Bet',
        authoriser: 'SYSTEM'
      })

      return Promise.all([newTransaction.save(), newWager.save()])
    })
  }).then(() => res.status(200).json({})).catch(next)
}
