const Decimal = require('decimal.js')
const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones
const moment = require('moment')

const logger = require('pino')({
  name: 'model:account',
  level: process.env.LOG_LEVEL || 'info'
})

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
  const balances = transactions.reduce((acc, transaction) => {
    const currencyBalance = acc[transaction.currency] || new Decimal(0)

    if (transaction.to && transaction.to._id === this._id) {
      return {
        ...acc,
        [transaction.currency]: Decimal.add(currencyBalance, transaction.amount)
      }
    } else if (transaction.from && transaction.from._id === this._id) {
      return {
        ...acc,
        [transaction.currency]: Decimal.sub(currencyBalance, transaction.amount)
      }
    } else {
      return acc
    }
  }, {})

  // convert to number for browser
  return Object.keys(balances).reduce(
    (obj, currency) => ({ ...obj, [currency]: balances[currency].toNumber() }), {}
  )
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
      topEnd: Infinity,
      rate: 0.40
    }
  ]
  let unallocated = annualGross
  let taxDueAnnually = new Decimal(0)

  for (let taxBracketIndex = 0; taxBracketIndex < taxBrackets.length; taxBracketIndex++) {
    const previousBracket = taxBrackets[taxBracketIndex - 1] || {
      topEnd: 0
    }
    const currentBracket = taxBrackets[taxBracketIndex]
    const bracketSize = Decimal.sub(currentBracket.topEnd, previousBracket.topEnd)
    const amountInBracket = unallocated.gt(bracketSize) ? bracketSize : unallocated

    taxDueAnnually = taxDueAnnually.add(amountInBracket.mul(currentBracket.rate))
    unallocated = unallocated.sub(amountInBracket)

    if (unallocated.eq(0)) {
      break
    }
  }

  return taxDueAnnually.toDP(2)
}

schema.methods.getSalaries = async function () {
  this.wages = this.wages.filter(id => id !== '*unemployed*')
  if (this.wages.length === 0) {
    this.wages = ['*unemployed*']
  }

  await this.populate('wages').execPopulate()

  return this.wages.reduce((acc, wage) => ({
    ...acc,
    [wage.currency]: (acc[wage.currency] || new Decimal(0)) + new Decimal(wage.value)
  }), {})
}

schema.methods.getPropertyIncomes = async function () {
  const { Property } = mongoose.models

  const ownedProperties = await Property.find({
    owner: this._id
  })

  return ownedProperties.reduce((acc, property) => ({
    ...acc,
    [property.currency]: (acc[property.currency] || new Decimal(0)) + new Decimal(property.returnRate)
  }), {})
}

schema.methods.handlePaymentJob = async function () {
  const { Transaction } = mongoose.models

  if (!this.accountType) {
    logger.warn(`account ${this._id} does not have a valid type linked!`)
    return
  }

  // get annual values
  const salaries = this.accountType.options.salary ? await this.getSalaries() : {}
  const propertyIncomes = this.accountType.options.property ? await this.getPropertyIncomes() : {}

  // get multiplier values
  const yearsSinceLastWage = moment().diff(this.lastPaid, 'years', true) * 10

  // create transactions for salaries/property income and apply tax
  const transactions = []
  for (const currency of [...Object.keys(salaries), ...Object.keys(propertyIncomes)]) {
    const propertyIncome = propertyIncomes[currency] || new Decimal(0)
    const salaryIncome = salaries[currency] || new Decimal(0)

    const grossAnnual = Decimal.add(salaryIncome, propertyIncome)
    const taxDue = calculateTaxDue(grossAnnual)
    const netAnnual = Decimal.sub(grossAnnual, taxDue)
    const periodNet = netAnnual.mul(yearsSinceLastWage).toDP(2)

    const meta = {
      salary: salaryIncome.toNumber(),
      property: propertyIncome.toNumber(),
      tax: taxDue.toNumber(),
      yearsSinceLastWage
    }

    transactions.push({
      to: this._id,
      from: '*economy*',
      description: 'Income',
      amount: periodNet.toNumber(),
      currency: currency,
      type: 'INCOME',
      authoriser: 'SYSTEM',
      meta
    })
  }

  // create transactions for savings
  if (this.accountType.options.interest.rate) {
    const rateToPay = Decimal.pow(this.accountType.options.interest.rate, yearsSinceLastWage)

    const { balances } = await this.calculateBalances()

    for (const [currency, amount] of Object.entries(balances)) {
      transactions.push({
        to: this._id,
        from: '*NubBank*',
        description: 'Interest on account',
        amount: rateToPay.mul(amount).toDP(2),
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

  this.lastPaid = Date.now()
  this.markModified('lastPaid')
  this.markModified('wages')
  await this.save()
}

schema.plugin(require('mongoose-autopopulate'))

const model = mongoose.model('Account', schema)

module.exports = model
