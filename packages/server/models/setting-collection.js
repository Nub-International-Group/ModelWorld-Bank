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
  let settings = await this.findOne({ _id: HARDCODED_KEY }).exec()

  if (!settings) {
    settings = await this.create({
      _id: HARDCODED_KEY,
      ...defaultSettings
    })
  }

  return settings.toJSON()
}

schema.statics.updateCurrent = async function (data) {
  await this.update(
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

schema.statics.resetCurrent = async function () {
  await this.updateCurrent(defaultSettings)

  return this.getCurrent()
}

const model = mongoose.model('Setting', schema)

module.exports = model
