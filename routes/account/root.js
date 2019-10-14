const Account = require('../../models/account')
const Transaction = require('../../models/transaction')
const nodeSchedule = require('node-schedule')

let leaderboard = []
let companyLeaderboard = []

let lastUpdated = null

module.exports = async function (req, res, next) {
  try {
    if (req.query.admin !== undefined) {
      if (req.decoded.admin === true) {
        const accounts = await Account.find({}).exec()

        return res.status(200).json(accounts)
      } else {
        return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
      }
    }

    if (req.query.public !== undefined) {
      const company = req.query.type === 'company'

      return res.status(200).json({leaderboard: (company ? companyLeaderboard : leaderboard), lastUpdated})
    }

    if (req.query.typeahead !== undefined) {
      const accounts = await Account.find({}, 'name description _id').exec()

      return res.status(200).json(accounts)
    }
  } catch (err) {
    next(err)
  }
}

function updateLeaderboard () {
  Account.find({public: true}).exec((err, accounts) => {
    if (err) {
      console.log(err)
    }

    const balances = {}
    Transaction.find({}).exec((err, trans) => {
      if (err) {
        console.log(err)
      }

      trans.forEach((el) => {
        if (!balances[el.to]) balances[el.to] = {}
        balances[el.to][el.currency] = (balances[el.to][el.currency] || 0) + el.amount

        if (!balances[el.from]) balances[el.from] = {}
        balances[el.from][el.currency] = (balances[el.from][el.currency] || 0) - el.amount
      })
      leaderboard = []
      companyLeaderboard = []

      accounts.forEach((acc) => {
        let bal = 0
        if (balances[acc._id]) bal = balances[acc._id]['GBP'] || 0

        if (!acc.company) {
          leaderboard.push({
            name: acc.name,
            description: acc.description,
            balance: bal
          })
        } else {
          companyLeaderboard.push({
            name: acc.name,
            description: acc.description,
            balance: bal
          })
        }

        lastUpdated = Date.now()
      })
    })
  })
}

nodeSchedule.scheduleJob('*/5 * * * *', updateLeaderboard)
updateLeaderboard()
