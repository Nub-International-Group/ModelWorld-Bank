const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones

const HARDCODED_KEY = 'MAIN_SETTINGS'

const defaultSettings = {
  taxBrackets: [
    {
      topEnd: 20419,
      rate: 0
    },
    {
      topEnd: 51050,
      rate: 0.15
    },
    {
      topEnd: 153150,
      rate: 0.375
    },
    {
      rate: 0.40
    }
  ]
}

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  taxBrackets: [
    {
      topEnd: Number,
      rate: {
        type: Number,
        required: true
      }
    }
  ]
}, { collection: 'settings' })

schema.statics.getCurrent = async function () {
  const settings = await this.findOne({ _id: HARDCODED_KEY }).exec()

  if (!settings) {
    this.create({
      _id: HARDCODED_KEY,
      ...defaultSettings
    })
  }
}

schema.statics.updateCurrent = async function (data) {
  return this.update(
    {
      _id: HARDCODED_KEY
    },
    data,
    {
      upsert: true,
      multi: false
    }
  ).exec()
}
const model = mongoose.model('Setting', schema)

module.exports = model
