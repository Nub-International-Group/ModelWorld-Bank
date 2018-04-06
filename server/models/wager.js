const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones
const Transaction = require('./transaction')

let schema = new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  amount: Number,
  currency: String,
  created: { type: Date, default: Date.now },
  bet: { type: String, ref: 'bet' },
  account: { type: String, ref: 'account' },
  betOption: String,
  odd: Number
}, { collection: 'wagers' })

schema.methods.resolveWager = function(winningOption, callback) {
  if (winningOption == this.betOption) {
    Transaction.create({
      from: '*NubBets*',
      to: this.account,
      amount: this.amount * this.odd,
      currency: this.currency,
      description: 'Original Bet: '+ this.amount + ' ' + this.currency + ' at ' + this.odd,
      authoriser: 'SYSTEM'
    }, function(err, doc) {
      if (err) return callback(err)

      callback(null)
    })
  } else {
    callback(null)
  }
}

let model = mongoose.model('wager', schema)

module.exports = model
