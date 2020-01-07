const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

const betOption = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  description: String,
  currentOdds: Number
})

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  description: String,
  created: { type: Date, default: Date.now },
  options: [betOption],
  status: {
    type: String,
    enum: ['CLOSED', 'OPEN', 'PAID_OUT']
  }
}, { collection: 'bets' })

/**
 *
 * Pays out bet with specified winner ID
 * @param winningOptionId
 * @param callback
 */
schema.methods.payOut = async function (winningOptionId) {
  const { Transaction, Wager } = mongoose.models
  if (this.status === 'PAID_OUT') {
    const err = new Error('Cannot pay out a bet twice')
    err.code = 422

    throw err
  }

  const wagers = await Wager.find({ betId: this._id, optionId: winningOptionId }).exec()

  for (const wager of wagers) {
    await Transaction.create({
      from: '*bets*',
      to: wager.accountId,
      amount: wager.amount * wager.odd,
      currency: wager.currency,
      description: 'Original Bet: ' + wager.amount + ' ' + wager.currency + ' at ' + wager.odd,
      authoriser: 'SYSTEM',
      type: 'WAGER_PAYOUT'
    })
  }

  this.status = 'PAID_OUT'
  await this.save()
}

const model = mongoose.model('Bet', schema)

module.exports = model
