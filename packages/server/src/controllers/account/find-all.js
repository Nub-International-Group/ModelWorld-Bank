const Account = require('../../models/account')
const Property = require('../../models/property')
const Transaction = require('../../models/transaction')
const nodeSchedule = require('node-schedule')

const logger = require('pino')({
  name: 'models:account:find-all',
  level: process.env.LOG_LEVEL || 'info'
})

let corporateAccountLeaderboard = []
let personalAccountLeaderboard = []

let lastUpdated = null

module.exports = async function (req, res, next) {
  try {
    if (req.query.admin !== undefined) {
      if (req.decoded.admin === true) {
        const accounts = await Account.find({}).exec()

        return res.status(200).json(accounts)
      } else {
        return res.status(403).json({ err: { code: 403, desc: 'You do not have permission' } })
      }
    }

    if (req.query.public !== undefined) {
      const company = req.query.type === 'company'

      return res.status(200).json({ leaderboard: (company ? corporateAccountLeaderboard : personalAccountLeaderboard), lastUpdated })
    }

    if (req.query.typeahead !== undefined) {
      const accounts = await Account.find({}, 'name description _id').exec()

      return res.status(200).json(accounts)
    }
  } catch (err) {
    next(err)
  }
}

async function updateLeaderboard () {
  logger.info('leaderboard update triggered')
  try {
    const accounts = await Account.find({ public: true }).exec()
    const balances = {}
    const transactions = await Transaction.find({}).exec()
    const properties = await Property.find({}).exec()

    for (const transaction of transactions) {
      if (!balances[transaction.to]) balances[transaction.to] = {}
      balances[transaction.to][transaction.currency] = (balances[transaction.to][transaction.currency] || 0) + transaction.amount

      if (!balances[transaction.from]) balances[transaction.from] = {}
      balances[transaction.from][transaction.currency] = (balances[transaction.from][transaction.currency] || 0) - transaction.amount
    }

    for (const property of properties) {
      const valuations = [...property.valuations]
      valuations.sort((a, b) => b.created - a.created)

      if (valuations[0]) {
        if (!balances[property.owner]) balances[property.owner] = {}
        balances[property.owner][property.currency] = (balances[property.owner][property.currency] || 0) + valuations[0].amount
      }
    }

    // reset leaderboards
    corporateAccountLeaderboard = []
    personalAccountLeaderboard = []

    // generate new leaderboards
    for (const account of accounts) {
      if (balances[account._id] && account.accountType) {
        const balance = balances[account._id].GBP || 0
        const lb = account.accountType.corporate ? corporateAccountLeaderboard : personalAccountLeaderboard
        lb.push({
          name: account.name,
          description: account.description,
          balance
        })
      }
    }

    lastUpdated = Date.now()
    logger.info('leaderboard update complete for %d accounts', accounts.length)
  } catch (err) {
    logger.error(err, 'error updating leaderboards')
  }
}

nodeSchedule.scheduleJob('*/5 * * * *', updateLeaderboard)
updateLeaderboard()
