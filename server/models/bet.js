const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

let betHistory = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  odd: Number,
  comment: String
})

let betOption = new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  name: String,
  description: String,
  currentOdds: Number,
  historicalOdds: [ betHistory ]
})

let schema = new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  name: String,
  description: String,
  created: { type: Date, default: Date.now },
  options: [ betOption ]
}, { collection: 'bets' })

let model = mongoose.model('bet', schema)

module.exports = model
