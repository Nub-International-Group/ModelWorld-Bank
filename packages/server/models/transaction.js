const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  from: { type: String, ref: 'Account' },
  to: { type: String, ref: 'Account' },
  amount: Number,
  currency: String,
  description: String,
  authoriser: String,
  meta: Object,
  created: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ['INCOME', 'INTEREST', 'TRANSFER', 'WAGER_PLACED', 'WAGER_PAYOUT', 'MISC']
  }
}, { collection: 'transactions' })

const model = mongoose.model('Transaction', schema)

module.exports = model
