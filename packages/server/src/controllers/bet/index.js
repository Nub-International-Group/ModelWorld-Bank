const router = (require('express')).Router()

const Bet = require('../../models/bet.js')

const utils = require('../../utils')
const middleware = require('../../middleware')

async function create (req, res, next) {
  try {
    const { status, options } = req.body
    if (!['CLOSED', 'OPEN'].includes(status)) {
      const err = new Error('Invalid bet status, cannot be created as PAID_OUT')
      err.code = 422

      throw err
    }

    const newBet = new Bet({
      name: req.body.name,
      description: req.body.description,
      status: status
    })

    for (const option of options) {
      if (isNaN(option.currentOdds) === false) {
        option.currentOdds = parseFloat(option.currentOdds)
      } else {
        const err = new Error('invalid odds value for option')
        err.code = 422

        throw err
      }

      newBet.options.push(option)
    }

    newBet.markModified('options')

    await newBet.save()

    res.status(200).json(newBet)
  } catch (err) {
    next(err)
  }
}

async function patch (req, res, next) {
  try {
    const bet = req.bet

    if (bet.status !== req.body.status) {
      throw new Error('Cannot edit status')
    }

    const doc = await Bet.findByIdAndUpdate(bet._id, req.body).exec()

    res.status(200).json(doc)
  } catch (err) {
    next(err)
  }
}

async function find (req, res, next) {
  Bet.find({}).exec(function (err, documents) {
    if (err) {
      return next(err)
    }

    return res.status(200).json(documents)
  })
}

function handleStatusChange (newStatus) {
  return async function (req, res, next) {
    try {
      const bet = req.bet

      if (bet.status === 'PAID_OUT') {
        const err = new Error('Paid out bets cannot change status')
        err.code = 422

        throw err
      }

      bet.status = newStatus
      await bet.save()

      res.status(200).json(bet)
    } catch (e) {
      next(e)
    }
  }
}

async function payOut (req, res, next) {
  try {
    const { bet } = req
    await bet.payOut(req.body.winningOptionId)
    res.status(200).json(bet)
  } catch (e) {
    next(e)
  }
}

router.get('/', find)
router.post('/', middleware.ensureAdmin, create)

router.patch('/:betId', middleware.ensureAdmin, patch)
router.post('/:betId/open', middleware.ensureAdmin, handleStatusChange('OPEN'))
router.post('/:betId/close', middleware.ensureAdmin, handleStatusChange('CLOSED'))
router.post('/:betId/pay-out', middleware.ensureAdmin, payOut)

router.param('betId', utils.generateParamMiddleware(Bet, 'bet'))

module.exports = {
  router
}
