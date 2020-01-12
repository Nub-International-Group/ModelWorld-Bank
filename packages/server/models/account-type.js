const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: String,
  description: String,
  corporate: Boolean,
  options: {
    salary: Boolean,
    benefits: Boolean,
    transactionFee: {
      mechanism: {
        type: String,
        enum: ['percentage']
      },
      rate: Number
    },
    interest: {
      mechanism: {
        type: String,
        enum: ['percentage']
      },
      rate: Number
    },
    betting: Boolean,
    property: Boolean
  }
}, { collection: 'account-types' })

const model = mongoose.model('AccountType', schema)

module.exports = model
