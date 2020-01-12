const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: String,
  description: String,
  returnRate: Number,
  image: String,
  owner: { type: String, ref: 'Account' },
  currency: String,
  valuations: [{
    user: String,
    amount: Number,
    created: { type: Date, default: Date.now }
  }]
}, { collection: 'properties' })

const model = mongoose.model('Property', schema)

module.exports = model
