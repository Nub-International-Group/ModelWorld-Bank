const router = (require('express')).Router()

const Wager = require('../../models/wager.js')
const Account = require('../../models/account.js')
const Transaction = require('../../models/transaction.js')
const Bet = require('../../models/bet.js')

const findByBet = async (req, res, next) => {
  try {
    const wagers = await Wager.find({ bet: req.params.id }).exec()

    res.status(200).json(wagers)
  } catch (err) {
    next(err)
  }
}

const create = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.body.target }).exec()
    const bet = await Bet.findOne({ _id: req.body.bet }).exec()

    const amount = Number(req.body.amount)
    if (!(account && bet)) {
      throw new Error('Invalid references.')
    }

    if (isNaN(amount)) {
      throw new Error('Invalid amount, cannot cast.')
    }

    if (amount <= 0) {
      throw new Error('Invalid amount, you can\'t bet nothing.')
    }

    if (amount > 1000000) {
      throw new Error('Invalid amount, you can only bet up to 1,000,000')
    }

    if (bet.status !== 1) {
      throw new Error('Bet is closed or paid out.')
    }

    if (account.users[req.decoded.name] < 2) {
      throw new Error('Incorrect permissions.')
    }

    const option = bet.options.id(req.body.option)

    const balanceData = await account.calculateBalance()
    if (!balanceData.balance.GBP) {
      throw new Error('No balance.')
    }

    if (balanceData.balance.GBP < amount) {
      throw new Error('Not enough balance.')
    }

    if (!option) {
      throw new Error('Invalid option.')
    }

    const newWager = new Wager({
      amount: amount,
      currency: 'GBP',
      bet: bet._id,
      account: account._id,
      betOption: option._id,
      odd: option.currentOdds
    })

    const newTransaction = new Transaction({
      from: account._id,
      to: '*NubBets*',
      amount: amount,
      currency: 'GBP',
      description: 'Payment for Bet',
      authoriser: 'SYSTEM',
      type: 'WAGER_PLACED'
    })

    await newTransaction.save()
    await newWager.save()

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

router.get('/bet/:id', findByBet)
router.post('/', create)

module.exports = {
  findByBet,
  create,
  router
}
