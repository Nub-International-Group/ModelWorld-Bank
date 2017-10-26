const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones
const moment = require('moment')
const Transaction = require('./transaction.js')
const WageRequest = require('./wageRequest')

let schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  description: String,
  public: Boolean,
  verified: Boolean,
  wages: [{ type: String, ref: 'wage' }], // wages: ['fdsuf923', 'ushdushfui', 'uishdfuis']
  created: { type: Date, default: Date.now },
  users: mongoose.Schema.Types.Mixed, // users: {'strideynet': NUM} NUM: 0 -> Blocked/Removed, 1 -> Read, 2 -> Read/Write, 3 -> Owner
  lastPaid: { type: Date, default: Date.now }
})

/**
 * calculateBalance
 * @callback
 * @return err err
 * @return {balance: {'GBP': 12543332, 'USD': 12313}, transactions: [{MONGOOSE OBJ},{MONGOOSE OBJ}]}
 */
schema.methods.calculateBalance = function (callback) {
  // TODO: Consider an approach where the to and froms are found simultanously and totted up, then finally added together. Possible enhancement to perf. - Async JS?
  // TODO: Grab Tos and Froms at the same time to reduce database access and make good use of our local memory - Simple
  Transaction.find({ 'to': this._id }, function (err, tos) {
    if (err) { return callback(err) }
    let balance = {}

    tos.forEach(function (element) {
      if (balance[element.currency] === undefined) {
        balance[element.currency] = element.amount
      } else {
        balance[element.currency] += element.amount
      }
    })

    Transaction.find({ 'from': this._id }, function (err, froms) {
      if (err) { return callback(err) }

      froms.forEach(function (element) {
        if (balance[element.currency] === undefined) {
          balance[element.currency] = -element.amount
        } else {
          balance[element.currency] -= element.amount
        }
      })

      let transactions = tos.concat(froms)

      return callback(null, {transactions, balance})
    })
  })
}

schema.methods.fetchWageRequests = function (callback) {
  WageRequest.find({account: this._id}).populate('wage').exec(function (err, wageRequests) {
    if (err) {
      return callback(err)
    }
    callback(null, wageRequests)
  })
}

schema.methods.payWages = function (callback) {
  let $this = this
  this.populate(function (err, account) { // Populate wage info
    if (err) {
      return callback(err)
    }

    let yearlyUnscaled = {}

    $this.wages.forEach(function (wage) {
      if (yearlyUnscaled[wage.currency]) {
        yearlyUnscaled[wage.currency] += wage.value
      } else {
        yearlyUnscaled[wage.currency] = wage.value
      }
    })

    let wageToPay = {}

    let yearsSinceLastwage = (moment().diff($this.lastPaid, 'years', true) * 10)

    let transactions = []
    for (let currency in yearlyUnscaled) {
      if (yearlyUnscaled.hasOwnProperty(currency)) {
        wageToPay[currency] = +(yearlyUnscaled[currency] * yearsSinceLastwage).toFixed(2)

        transactions.push({
          to: $this._id,
          from: '*economy*',
          description: 'Wages Paid. Yearly wage: ' + yearlyUnscaled[currency] + ' ' + currency,
          amount: wageToPay[currency],
          currency: currency,
          authoriser: 'SYSTEM'
        })
      }
    }

    Transaction.create(transactions, function (err) {
      if (err) {
        return callback(err)
      }

      return callback(null)
    })
  })
}

let model = mongoose.model('account', schema)

module.exports = model
