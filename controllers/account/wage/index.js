const router = (require('express')).Router()

const WageRequest = require('../../../models/wage-request')

const middleware = require('../middleware')

const findByAccount = async (req, res, next) => {
  try {
    const account = req.account
    const wageRequests = await WageRequest.find({ account: account._id }).populate('wage').exec()

    res.status(200).json(wageRequests)
  } catch (e) {
    next(e)
  }
}

const createWageRequest = async (req, res, next) => {
  try {
    const account = req.account

    const wageRequest = await WageRequest.create({
      account: account._id,
      wage: req.body.wageID,
      user: req.decoded.name
    })

    await wageRequest.save()
    const wageRequests = await WageRequest.find({ account: account._id }).populate('wage').exec()

    res.status(200).json(wageRequests)
  } catch (e) {
    next(e)
  }
}

const deleteById = async (req, res, next) => {
  try {
    const account = req.account

    const index = account.wages.indexOf(req.params.wageId)

    if (index > -1) {
      account.wages.splice(index, 1)
    }

    account.markModified('wages')

    await account.save()
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

router.get('/', middleware.accountWithPerms(1), findByAccount)
router.post('/', middleware.accountWithPerms(3), createWageRequest)
router.delete('/:wageId', middleware.accountWithPerms(3), deleteById)

module.exports = {
  router
}
