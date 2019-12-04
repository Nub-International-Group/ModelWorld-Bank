const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones
const async = require('async')

const betOption = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  description: String,
  currentOdds: Number
})

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  description: String,
  created: { type: Date, default: Date.now },
  options: [betOption],
  status: Number // 0 - Not Open 1 - Open 2 - Paid out
}, { collection: 'bets' })

/**
 *
 * Pays out bet with specified winner ID
 * @param winner
 * @param callback
 */
schema.methods.payOut = function (winner, callback) {
  const { Wager } = mongoose.models
  if (this.status !== 2) {
    Wager.find({ bet: this._id }).exec((err, wagers) => {
      if (err) {
        return callback(err)
      }

      async.each(wagers, (wager, callbackDeep) => {
        wager.resolveWager(winner, callbackDeep)
      }, (err) => {
        if (err) {
          return callback(err)
        }

        this.status = 2

        this.markModified('status')
        this.save((err) => {
          if (err) {
            return callback(err)
          }

          callback(null)
        })
      })
    })
  }
}

const model = mongoose.model('Bet', schema)

module.exports = model
