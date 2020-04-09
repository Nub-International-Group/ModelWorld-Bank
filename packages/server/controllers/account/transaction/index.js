const router = (require('express')).Router()

const Account = require('../../../models/account.js')
const Transaction = require('../../../models/transaction')

const middleware = require('../middleware')

async function find (req, res, next) {
  try {
    req.account.calculateBalances().then(({ transactions, balances }) => {
      res.status(200).json({
        transactions,
        balances
      })
    }).catch(next)
  } catch (e) {
    next(e)
  }
}

async function create (req, res, next) {
  try {
    const sendingAccount = req.account

    if (sendingAccount == null) {
      const err = new Error('Sending account not found')
      err.code = 404

      throw err
    }

    req.body.currency = 'GBP'
    if (['GBP', 'USD'].includes(req.body.currency) === false) {
      const err = new Error('Invalid currency specified')
      err.code = 422

      throw err
    }

    if ((sendingAccount.users[req.decoded.name] === 3) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      const targetAccount = await Account.findOne({ _id: req.body.target }).exec()
      if (targetAccount === null) {
        const err = new Error('Target account not found')
        err.code = 404

        throw err
      }

      const amount = Number(req.body.amount)

      if (isNaN(amount)) {
        const err = new Error('Invalid amount')
        err.code = 422

        throw err
      }

      if (amount <= 0) {
        const err = new Error('Cannot send negative or zero')
        err.code = 422

        throw err
      }

      const fee = Math.floor(amount * sendingAccount.accountType.options.transactionFee.rate * 100) / 100 // floor to 2 dp

      const { balances } = await sendingAccount.calculateBalances()
      if ((!balances[req.body.currency] || balances[req.body.currency] < (amount + fee)) && sendingAccount._id !== '*Bottomless*') {
        const err = new Error('Not enough balance!')
        err.code = 422

        throw err
      }

      const transactions = [{
        from: sendingAccount._id,
        to: targetAccount._id,
        amount: amount,
        type: 'TRANSFER',
        currency: req.body.currency,
        description: req.body.description,
        authoriser: req.decoded.name,
        meta: {
          feePaid: fee,
          feeRate: sendingAccount.accountType.options.transactionFee.rate
        }
      }, {
        from: sendingAccount._id,
        to: '*NubBank*',
        type: 'MISC',
        amount: fee,
        currency: req.body.currency,
        description: 'Tx Fee',
        authoriser: req.decoded.name
      }]

      await Transaction.insertMany(transactions)
      res.status(204).end()
    } else {
      const err = new Error('You don\'t have permission to transfer from this account')
      err.code = 403

      throw err
    }
  } catch (err) {
    next(err)
  }
}

router.get('/', middleware.accountWithPerms(1), find)
router.post('/', middleware.accountWithPerms(3), create)

module.exports = {
  router
}
