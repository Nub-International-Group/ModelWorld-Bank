const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

let schema = new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  from: { type: String, ref: 'account' },
  to: { type: String, ref: 'account' },
  amount: Number,
  currency: String,
  description: String,
  authoriser: String,
  created: {type: Date, default: Date.now},
  invalidated: {type: Boolean, default: false}
}, { collection: 'transactions' })

let model = mongoose.model('transaction', schema)

module.exports = model
