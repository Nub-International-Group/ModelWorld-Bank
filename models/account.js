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

const calculateBalancesFromTransactions = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const currencyBalance = acc[transaction.currency] || 0

    if (transaction.to === this._id) {
      return {
        ...acc,
        [transaction.currency]: currencyBalance + transaction.amount
      }
    } else if (transaction.from === this._id) {
      return {
        ...acc,
        [transaction.currency]: currencyBalance - transaction.amount
      }
    } else {
      return acc
    }
  }, {})
}
schema.calculateBalancesFromTransactions = calculateBalancesFromTransactions

/**
 * calculateBalance
 * @callback
 * @return Promise
 */
schema.methods.calculateBalances = async function () {
  const { Transaction } = mongoose.models
  const transactions = [
    ...(await Transaction.find({ to: this._id }).populate('from')),
    ...(await Transaction.find({ from: this._id }).populate('to'))
  ]

  return {
    transactions,
    balances: calculateBalancesFromTransactions(transactions)
  }
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
  if (this.wages.length === 0) {
    this.wages = ['*unemployed*']
  }

  await this.populate('wages').execPopulate()

  return this.wages.reduce((acc, wage) => ({
    ...acc,
    [wage.currency]: (acc[wage.currency] || 0) + wage.value
  }), {})
}

schema.methods.getPropertyIncomes = async function () {
  const { Property } = mongoose.models

  const ownedProperties = await Property.find({
    owner: this._id
  })

  return ownedProperties.reduce((acc, property) => ({
    ...acc,
    [property.currency]: (acc[property.currency] || 0) + property.returnRate
  }), {})
}

const roundCurrency = val => Math.floor(val * 100) / 100
schema.methods.handlePaymentJob = async function () {
  const { Transaction } = mongoose.models

  // get annual values
  const salaries = this.accountType.options.salary ? await this.getSalaries() : {}
  const propertyIncomes = this.accountType.options.property ? await this.getPropertyIncomes() : {}

  // get multiplier values
  const yearsSinceLastWage = moment().diff(this.lastPaid, 'years', true) * 10

  // create transactions for salaries/property income and apply tax
  const transactions = []
  for (const currency of [...Object.keys(salaries), ...Object.keys(propertyIncomes)]) {
    const grossAnnual = roundCurrency(salaries[currency] + propertyIncomes[currency])
    const taxDue = roundCurrency(calculateTaxDue(grossAnnual))
    const netAnnual = grossAnnual - taxDue
    const periodNet = roundCurrency(netAnnual * yearsSinceLastWage)

    const meta = {
      gross: grossAnnual,
      salary: salaries[currency],
      property: propertyIncomes[currency],
      tax: taxDue
    }

    transactions.push({
      to: this._id,
      from: '*economy*',
      description: 'Income',
      amount: periodNet,
      currency: currency,
      type: 'INCOME',
      authoriser: 'SYSTEM',
      meta
    })
  }

  // create transactions for savings
  if (this.accountType.options.interest.rate) {
    const rateToPay = Math.pow(this.accountType.options.interest.rate, yearsSinceLastWage)

    const { balances } = await this.calculateBalances()

    for (const [currency, amount] of Object.entries(balances)) {
      transactions.push({
        to: this._id,
        from: '*NubBank*',
        description: 'Interest on account',
        amount: roundCurrency(amount * rateToPay),
        currency,
        type: 'INTEREST',
        authoriser: 'SYSTEM',
        meta: {
          AER: this.accountType.options.interest.rate
        }
      })
    }
  }

  await Transaction.create(transactions)
  await this.update({ lastPaid: Date.now() }).exec()
  await this.save()
}

schema.plugin(require('mongoose-autopopulate'))

const model = mongoose.model('Account', schema)

module.exports = model
