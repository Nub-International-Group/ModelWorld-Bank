const Account = require('../../models/account')
const Transaction = require('../../models/transaction')
const nodeSchedule = require('node-schedule')

let leaderboard = []
let lastUpdated = null;

module.exports = function (req, res) {
  return res.status(200).json({leaderboard, lastUpdated})
}

function updateLeaderboard () {
  Account.find({public: true}).exec((err, accounts) =>{
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

      accounts.forEach((acc) => {
        let bal = 0
        if (balances[acc._id]) bal = balances[acc._id]['GBP'] || 0

        leaderboard.push({
          name: acc.name,
          description: acc.description,
          balance: bal
        })

        lastUpdated = Date.now()
      })
    })

  })
}

nodeSchedule.scheduleJob('*/5 * * * *', updateLeaderboard)
updateLeaderboard()
