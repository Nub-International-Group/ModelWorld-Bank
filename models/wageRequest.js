const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  created: { type: Date, default: Date.now },
  account: { type: String, ref: 'Account' },
  wage: { type: String, ref: 'Wage' },
  user: String
}, { collection: 'wagerequests' })

const model = mongoose.model('WageRequest', schema)

module.exports = model
