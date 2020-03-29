const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  amount: Number,
  currency: String,
  created: { type: Date, default: Date.now },
  betId: { type: String, ref: 'Bet' },
  accountId: { type: String, ref: 'Account' },
  optionId: String,
  odd: Number
}, { collection: 'wagers', toJSON: { virtuals: true } })

schema.virtual('account', {
  ref: 'Account',
  localField: 'accountId',
  foreignField: '_id',
  justOne: true
})

schema.virtual('bet', {
  ref: 'Bet',
  localField: 'betId',
  foreignField: '_id',
  justOne: true
})

const model = mongoose.model('Wager', schema)

module.exports = model
