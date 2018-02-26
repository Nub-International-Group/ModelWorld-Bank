const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

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

let model = mongoose.model('wager', schema)

module.exports = model
