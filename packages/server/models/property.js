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
  }],
  tags: [String]
}, { collection: 'properties' })

schema.methods.getLastValue = function () {
  const valuations = [...this.valuations]
  valuations.sort((a, b) => b.created - a.created)

  return valuations[0] ? valuations[0].amount : null
}

const model = mongoose.model('Property', schema)

module.exports = model
