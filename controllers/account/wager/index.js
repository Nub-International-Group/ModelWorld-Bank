const router = (require('express')).Router()

const Wager = require('../../../models/wager')

const middleware = require('../middleware')

async function find (req, res, next) {
  try {
    const wagers = await Wager.find({ account: req.account._id }).populate('bet').exec()

    res.status(200).json(wagers)
  } catch (e) {
    next(e)
  }
}

router.get('/', middleware.accountWithPerms(1), find)

module.exports = {
  router
}
