const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

let schema = new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  name: String,
  description: String,
  public: Boolean,
  created: {type: Date, default: Date.now},
  users: mongoose.Schema.Types.Mixed // users: {userID: {permissions: ['x', 'y', 'z']}}
})

let model = mongoose.model('account', schema)

module.exports = model
