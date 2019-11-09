const router = (require('express')).Router()

const Account = require('../../../models/account.js')
const Transaction = require('../../../models/transaction')

const middleware = require('../middleware')

const findByAccount = async (req, res, next) => {
  try {
    req.account.calculateBalance().then((data) => {
      res.status(200).json(data)
    }).catch(next)
  } catch (e) {
    next(e)
  }
}

const create = async (req, res, next) => {
  try {
    const sendingAccount = await Account.findOne({ _id: req.params.accountId }).exec()

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
      if (sendingAccount === null) {
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
        const err = new Error('Cannot send negative')
        err.code = 422

        throw err
      }

      const data = await sendingAccount.calculateBalance()
      if (data.balance[req.body.currency] || sendingAccount._id === '*economy*') {
        if (data.balance[req.body.currency] >= (amount + 10) || sendingAccount._id === '*economy*') {
          const transactions = [{
            from: sendingAccount._id,
            to: targetAccount._id,
            amount: amount,
            currency: req.body.currency,
            description: req.body.description,
            authoriser: req.decoded.name
          }, {
            from: sendingAccount._id,
            to: 'SJS4nVQLG',
            amount: 10,
            currency: req.body.currency,
            description: 'Tx Fee',
            authoriser: req.decoded.name
          }]

          await Transaction.insertMany(transactions)
          res.status(204).end()
        } else {
          throw new Error('Not enough balance')
        }
      } else {
        throw new Error('No balance in currency')
      }
    } else {
      const err = new Error('You don\'t have permission to transfer from this account')
      err.code = 403

      throw err
    }
  } catch (err) {
    next(err)
  }
}

router.get('/', middleware.accountWithPerms(1), findByAccount)
router.post('/', create)

module.exports = {
  router
}
