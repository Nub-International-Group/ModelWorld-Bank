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

const calculateTaxDue = (annualGross) => {
  const taxBrackets = [
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
  let unallocated = annualGross
  let taxDueAnnually = 0

  for (const taxBracket of taxBrackets) {
    if (unallocated >= taxBracket.topEnd) {
      taxDueAnnually += taxBracket.topEnd * taxBracket.rate
      unallocated -= taxBracket.topEnd
    } else {
      taxDueAnnually += unallocated * taxBracket.rate
      break
    }
  }

  return taxDueAnnually
}

schema.methods.getSalaries = async function () {
  const incomePerCurrency = {}
  let wages = []
  if (wages.length === 0) {
    wages = ['*unemployed*']
  }

  await this.populate('wages').execPopulate()
  for (const wage of wages) {
    if (incomePerCurrency[wage.currency]) {
      incomePerCurrency[wage.currency] += wage.value
    } else {
      incomePerCurrency[wage.currency] = wage.value
    }
  }

  return incomePerCurrency
}

schema.methods.getPropertyIncomes = async function () {
  const incomePerCurrency = {}

  return incomePerCurrency
}

schema.methods.handlePaymentJob = async function () {
  const { Transaction } = mongoose.models

  // get annual values
  const salaries = await this.getSalaries()
  const propertyIncomes = await this.getPropertyIncomes()

  // get multiplier values
  const yearsSinceLastWage = (moment().diff(this.lastPaid, 'years', true) * 10)

  const transactions = []
  for (const currency of [...Object.keys(salaries), ...Object.keys(propertyIncomes)]) {
    const grossAnnual = salaries[currency] + propertyIncomes[currency]
    const taxDueAnnually = calculateTaxDue(grossAnnual)
    const periodGross = (grossAnnual * yearsSinceLastWage)
    const periodTax = (taxDueAnnually * yearsSinceLastWage)

    transactions.push({
      to: this._id,
      from: '*economy*',
      description: 'Income',
      amount: (periodGross - periodTax).toFixed(2),
      currency: currency,
      type: 'INCOME',
      authoriser: 'SYSTEM',
      meta: {
        gross: grossAnnual.toFixed(2),
        salary: salaries[currency].toFixed(2),
        property: propertyIncomes[currency].toFixed(2),
        tax: taxDueAnnually.toFixed(2)
      }
    })
  }

  await Transaction.create(transactions)
  await this.update({ lastPaid: Date.now() }).exec()
  await this.save()
}

schema.plugin(require('mongoose-autopopulate'))

const model = mongoose.model('Account', schema)

module.exports = model
