const router = (require('express')).Router()

const Wager = require('../../../models/transaction')

const middleware = require('../middleware')

const findByAccount = async (req, res, next) => {
  try {
    const wagers = await Wager.find({ account: req.account._id }).populate('bet').exec()

    res.status(200).json(wagers)
  } catch (e) {
    next(e)
  }
}

router.get('/', middleware.accountWithPerms(), findByAccount)

module.exports = {
  router
}
