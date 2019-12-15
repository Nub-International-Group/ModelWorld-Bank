const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones
const moment = require('moment')

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  description: String,
  public: Boolean,
  verified: Boolean,
  wages: [{ type: String, ref: 'Wage' }], // wages: ['fdsuf923', 'ushdushfui', 'uishdfuis']
  created: { type: Date, default: Date.now },
  users: mongoose.Schema.Types.Mixed, // users: {'strideynet': NUM} NUM: 0 -> Blocked/Removed, 1 -> Read, 2 -> Read/Write, 3 -> Owner
  lastPaid: { type: Date, default: Date.now },
  accountType: { type: String, ref: 'AccountType', autopopulate: true }
}, { collection: 'accounts' })

/**
 * calculateBalance
 * @callback
 * @return Promise
 */
schema.methods.calculateBalance = function () {
  const { Transaction } = mongoose.models
  return new Promise((resolve, reject) => {
    Transaction.find({ to: this._id }).sort('-created').populate('from').exec((err, tos) => {
      if (err) {
        return reject(err)
      }

      const balance = {}

      tos.forEach(function (element) {
        if (balance[element.currency] === undefined) {
          balance[element.currency] = element.amount
        } else {
          balance[element.currency] += element.amount
        }
      })

      Transaction.find({ from: this._id }).sort('-created').populate('to').exec((err, froms) => {
        if (err) {
          return reject(err)
        }

        froms.forEach(function (element) {
          if (balance[element.currency] === undefined) {
            balance[element.currency] = -element.amount
          } else {
            balance[element.currency] -= element.amount
          }
        })

        const transactions = tos.concat(froms)

        return resolve({ transactions, balance })
      })
    })
  })
}

schema.methods.fetchWageRequests = function (callback) {
  const { WageRequest } = mongoose.models
  WageRequest.find({ account: this._id }).populate('wage').exec(function (err, wageRequests) {
    if (err) {
      return callback(err)
    }
    callback(null, wageRequests)
  })
}

schema.methods.payWages = function (callback) {
  const { Transaction } = mongoose.models
  if (this.wages.length === 0) {
    this.wages = ['*unemployed*']
    this.markModified('wages')
  }

  this.populate('wages', (err, account) => { // Populate wage info
    if (err) {
      return callback(err)
    }

    const yearlyUnscaled = {}

    this.wages.forEach(function (wage) {
      if (yearlyUnscaled[wage.currency]) {
        yearlyUnscaled[wage.currency] += wage.value
      } else {
        yearlyUnscaled[wage.currency] = wage.value
      }
    })

    const wageToPay = {}

    const yearsSinceLastwage = (moment().diff(this.lastPaid, 'years', true) * 10)

    const transactions = []
    for (const currency in yearlyUnscaled) {
      if (yearlyUnscaled.hasOwnProperty(currency)) {
        wageToPay[currency] = +(yearlyUnscaled[currency] * yearsSinceLastwage).toFixed(2)

        transactions.push({
          to: this._id,
          from: '*economy*',
          description: 'Wages Paid. Yearly wage: ' + yearlyUnscaled[currency].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' ' + currency,
          amount: wageToPay[currency],
          currency: currency,
          authoriser: 'SYSTEM'
        })

        /*
          Taxation System:
        */

        const tax = [
          {
            topEnd: 12000,
            rate: 0
          },
          {
            topEnd: 45000,
            rate: 0.2
          },
          {
            topEnd: 150000,
            rate: 0.4
          },
          {
            topEnd: Infinity,
            rate: 0.45
          }
        ]

        let unCalculated = yearlyUnscaled[currency]
        let taxAmount = 0

        for (let bracket = 0; bracket < tax.length; bracket++) {
          const taxBracket = tax[bracket]

          if (unCalculated >= taxBracket.topEnd) {
            taxAmount += taxBracket.topEnd * taxBracket.rate
            unCalculated -= taxBracket.topEnd
          } else {
            taxAmount += unCalculated * taxBracket.rate
            break
          }
        }

        const taxAmountScaled = +(taxAmount * yearsSinceLastwage).toFixed(2)

        transactions.push({
          to: '*economy*',
          from: this._id,
          description: 'Taxes Paid. Total rate: ' + ((taxAmount / yearlyUnscaled[currency]) * 100).toFixed(2) + '%',
          amount: taxAmountScaled,
          currency: currency,
          authoriser: 'SYSTEM'
        })
      }
    }

    Transaction.create(transactions, (err) => {
      if (err) {
        return callback(err)
      }

      this.lastPaid = Date.now()
      this.markModified('lastPaid')

      if (this.wages === ['*unemployed*']) {
        this.wages = []
        this.markModified('wages')
      }

      this.save(function (err) {
        if (err) {
          return callback(err)
        }

        return callback(null)
      })
    })
  })
}

schema.plugin(require('mongoose-autopopulate'))

const model = mongoose.model('Account', schema)

module.exports = model
