const mongoose = require('mongoose')
const shortid = require('shortid') // Smarter, shorter IDs than the default MongoDB ones
const Transaction = require('./transaction')
const Property = require('./property')
const Account = require('./account')
const CURRENCIES = ['GBP']

const logger = require('pino')({
  name: 'model:economy-report',
  level: process.env.LOG_LEVEL || 'info'
})

const individualEconomy = new mongoose.Schema({
  _id: String, // Currency Code
  totalAssetValue: Number,
  totalCash: Number,
  accountStats: mongoose.Schema.Types.Mixed
})

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  monthsSinceEpoch: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  currencies: [individualEconomy]
}, { collection: 'economy-reports' })

schema.statics.generateCurrencyReport = async function (currencyCode) {
  const transactions = await Transaction.find({ currency: currencyCode, from: '*economy*' }).exec()
  const properties = await Property.find({ currency: currencyCode }).exec()

  const totalCash = transactions.reduce((acc, tx) => {
    return acc + tx.amount
  }, 0)

  const totalAssetValue = properties.reduce((acc, property) => {
    const value = property.getLastValue()
    return acc + (value || 0)
  }, 0)

  const accountStats = await this.generateAccountStats(currencyCode)

  return {
    _id: currencyCode,
    totalCash,
    totalAssetValue,
    accountStats
  }
}

schema.statics.generateAccountStats = async function (currencyCode) {
  const accounts = await Account.find({}).exec()
  const transactions = await Transaction.find({ currency: currencyCode }).exec()
  const properties = await Property.find({ currency: currencyCode }).exec()

  const balances = {}
  const assetOwnership = {}

  for (const transaction of transactions) {
    balances[transaction.to] = (balances[transaction.to] || 0) + transaction.amount
    balances[transaction.from] = (balances[transaction.from] || 0) - transaction.amount
  }

  for (const property of properties) {
    const val = property.getLastValue()
    if (val) {
      assetOwnership[property.owner] = (assetOwnership[property.owner] || 0) + val
    }
  }

  const accountStats = {}
  for (const account of accounts) {
    accountStats[account._id] = {
      _id: account._id,
      balance: balances[account._id] || 0,
      assets: assetOwnership[account._id] || 0,
      netWorth: (balances[account._id] || 0) + (assetOwnership[account._id] || 0),
      public: account.public,
      corporate: account.accountType.corporate
    }
  }

  return accountStats
}

const model = mongoose.model('EconomyReport', schema)

model.generateReport = async (monthsSinceEpoch) => {
  let report = await model.findOne({ monthsSinceEpoch }).exec()
  if (!report) {
    report = new model({
      monthsSinceEpoch
    })
  }

  report.currencies = await Promise.all(CURRENCIES.map(code => model.generateCurrencyReport(code)))
  report.lastUpdated = new Date()
  await report.save()
}

module.exports = model
