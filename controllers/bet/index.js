const router = (require('express')).Router()

const Bet = require('../../models/bet.js')

const middleware = require('../../middleware')

const statuses = ['Closed', 'Open', 'Paid']

const create = async (req, res, next) => {
  try {
    req.body.status = statuses.indexOf(req.body.status)

    if (req.body.status === -1) {
      const err = new Error('Invalid bet status')
      err.code = 400

      throw err
    }

    const newBet = new Bet({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status
    })

    for (const option of req.body.options) {
      if (isNaN(option.currentOdds) === false) {
        option.currentOdds = parseFloat(option.currentOdds)
      } else {
        const err = new Error('invalid odds value for option')
        err.code = 400

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

const findAll = async (req, res, next) => {
  Bet.find({}).exec(function (err, documents) {
    if (err) {
      return next(err)
    }

    return res.status(200).json(documents)
  })
}

const putStatus = async (req, res, next) => {
  Bet.findById(req.params.id).exec().then((bet) => {
    if (bet) {
      req.body.status = statuses.indexOf(req.body.status)

      if (req.body.status === -1) {
        return res.status(500).json({ err: { code: 500, desc: 'Invalid data entry, Status invalid...' } })
      }

      if (req.body.status !== 2) {
        bet.status = req.body.status
        bet.markModified('status')

        bet.save((err) => {
          if (err) {
            return next(err)
          }

          return res.status(200).json({})
        })
      } else {
        bet.payOut(req.body.winner, (err) => {
          if (err) {
            return next(err)
          }

          return res.status(200).json({})
        })
      }
    } else {
      throw new Error(404)
    }
  }).catch((err) => {
    return res.status(500).json({ err: { code: 500, desc: 'Something went wrong.' } })
  })
}

router.get('/', findAll)
router.post('/', middleware.ensureAdmin, create)
router.put('/:id/status', middleware.ensureAdmin, putStatus)

module.exports = {
  router
}
