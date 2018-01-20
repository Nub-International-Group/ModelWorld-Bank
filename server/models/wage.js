const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

let schema = new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  name: String,
  description: String,
  value: Number,
  currency: String
}, { collection: 'wages' })

let model = mongoose.model('wage', schema)

module.exports = model
