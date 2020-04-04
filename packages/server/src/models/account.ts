import { Decimal } from 'decimal.js'
import * as moment from 'moment'
import * as mongoose from 'mongoose'
import * as pino from 'pino'
import * as shortid from 'shortid' // smarter, shorter IDs than the default MongoDB ones

import { ITransaction } from './transaction'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  name: 'model:account'
})

export interface IAccount extends mongoose.Document {
  _id: string
  accountType: string
  created: Date
  description: string
  lastPaid: string
  name: string
  public: boolean
  users: {
    [user: string]: number
  }
  verified: boolean
  wages: string[]
}

const schema = new mongoose.Schema({
  _id: { default: shortid.generate, type: String },
  accountType: { autopopulate: true, ref: 'AccountType', type: String },
  created: { default: Date.now, type: Date },
  description: String,
  lastPaid: { default: Date.now, type: Date },
  name: String,
  public: Boolean,
  users: mongoose.Schema.Types.Mixed, // users: {'strideynet': NUM} NUM: 0 -> Blocked/Removed, 1 -> Read, 2 -> Read/Write, 3 -> Owner
  verified: Boolean,
  wages: [{ ref: 'Wage', type: String }]
}, { collection: 'accounts' })

const calculateBalancesFromTransactions = (transactions: ITransaction[]) => {
  const balances = transactions.reduce((acc, transaction) => {
    if (transaction.to instanceof IAccount) {

    }
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
  }, {} as {[currency: string]: Decimal})

  // convert to number for browser
  return Object.keys(balances).reduce(
    (obj, currency) => ({ ...obj, [currency]: balances[currency].toNumber() }), {}
  )
}
schema.statics.calculateBalancesFromTransactions = calculateBalancesFromTransactions

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
    balances: calculateBalancesFromTransactions(transactions),
    transactions
  }
}

const calculateTaxDue = (annualGross: Decimal) => {
  const taxBrackets = [
    {
      rate: 0,
      topEnd: 20419
    },
    {
      rate: 0.15,
      topEnd: 51050
    },
    {
      rate: 0.375,
      topEnd: 153150
    },
    {
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
    if (taxBracketIndex === (taxBrackets.length - 1)) {
      currentBracket.topEnd = Infinity
    }

    const bracketSize = Decimal.sub(currentBracket.topEnd || 0, previousBracket.topEnd || 0)
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
  if (this.wages.length === 0 && !this.accountType.corporate) {
    this.wages = ['*unemployed*']
  }

  await this.populate('wages').execPopulate()

  return this.wages.reduce((acc, wage) => ({
    ...acc,
    [wage.currency]: Decimal.add(acc[wage.currency] || new Decimal(0), wage.value)
  }), {})
}

schema.methods.getPropertyIncomes = async function () {
  const { Property } = mongoose.models

  const ownedProperties = await Property.find({
    owner: this._id
  })

  return ownedProperties.reduce((acc, property) => ({
    ...acc,
    [property.currency]: Decimal.add((acc[property.currency] || 0), property.returnRate)
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
  for (const currency of [...new Set([...Object.keys(salaries), ...Object.keys(propertyIncomes)])]) {
    const propertyIncome = propertyIncomes[currency] || new Decimal(0)
    const salaryIncome = salaries[currency] || new Decimal(0)

    const grossAnnual = Decimal.add(salaryIncome, propertyIncome)
    const taxAnnual = this.accountType.corporate ? new Decimal(0) : calculateTaxDue(grossAnnual)
    const netAnnual = grossAnnual.sub(taxAnnual)

    const periodNet = netAnnual.mul(yearsSinceLastWage).toDP(2)

    const meta = {
      grossAnnual,
      property: propertyIncome.mul(yearsSinceLastWage).toDP(2).toNumber(),
      propertyAnnual: propertyIncome,
      salary: salaryIncome.mul(yearsSinceLastWage).toDP(2).toNumber(),
      salaryAnnual: salaryIncome,
      tax: taxAnnual.mul(yearsSinceLastWage).toDP(2).toNumber(),
      taxAnnual,
      yearsSinceLastWage
    }

    transactions.push({
      amount: periodNet.toNumber(),
      authoriser: 'SYSTEM',
      currency: currency,
      description: 'Income',
      from: '*economy*',
      meta,
      to: this._id,
      type: 'INCOME'
    })
  }

  // create transactions for savings
  if (this.accountType.options.interest.rate) {
    const effectiveRate = (new Decimal(this.accountType.options.interest.rate)).add(1).toPower(yearsSinceLastWage).sub(1)

    const { balances } = await this.calculateBalances()

    for (const [currency, amount] of Object.entries(balances)) {
      transactions.push({
        amount: effectiveRate.mul(amount).toDP(2),
        authoriser: 'SYSTEM',
        currency,
        description: 'Interest on account',
        from: '*NubBank*',
        meta: {
          AER: this.accountType.options.interest.rate
        },
        to: this._id,
        type: 'INTEREST'
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

export default mongoose.model<IAccount>('Account', schema)
