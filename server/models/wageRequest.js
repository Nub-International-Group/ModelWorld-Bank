const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

let schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  created: { type: Date, default: Date.now },
  account: { type: String, ref: 'account' },
  wage: { type: String, ref: 'wage' },
  user: String
}, { collection: 'wagerequests' })

let model = mongoose.model('wageRequest', schema)

module.exports = model
