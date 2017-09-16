const mongoose = require('mongoose')

let schema = new mongoose.Schema({
  name: String,
  description: String,
  public: Boolean,
  created: {type: Date, default: Date.now},
  users: mongoose.Schema.Types.Mixed // users: {userID: {permissions: ['x', 'y', 'z']}}
})

let model = mongoose.model('account', schema)

module.exports = model
