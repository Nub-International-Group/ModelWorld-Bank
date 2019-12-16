const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  amount: Number,
  currency: String,
  created: { type: Date, default: Date.now },
  bet: { type: String, ref: 'Bet' },
  account: { type: String, ref: 'Account' },
  betOption: String,
  odd: Number
}, { collection: 'wagers' })

schema.methods.resolveWager = function (winningOption, callback) {
  const { Transaction } = mongoose.models
  if (winningOption === this.betOption) {
    Transaction.create({
      from: '*bets*',
      to: this.account,
      amount: this.amount * this.odd,
      currency: this.currency,
      description: 'Original Bet: ' + this.amount + ' ' + this.currency + ' at ' + this.odd,
      authoriser: 'SYSTEM',
      type: 'WAGER_PAYOUT'
    }, function (err, doc) {
      if (err) return callback(err)

      callback(null)
    })
  } else {
    callback(null)
  }
}

const model = mongoose.model('Wager', schema)

module.exports = model
