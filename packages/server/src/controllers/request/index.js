const router = (require('express')).Router()

const Account = require('../../models/account.js')
const WageRequest = require('../../models/wage-request.js')

const middleware = require('../../middleware')

const findAll = async (req, res, next) => {
  try {
    const wageRequests = await WageRequest.find({}).populate('wage').populate('account').exec()

    res.status(200).json(wageRequests)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const wageRequest = await WageRequest.findOne({ _id: req.params.id }).populate('wage').populate('account').exec()

    if (wageRequest === null) {
      const err = new Error('Wage Request does not exist')
      err.code = 404

      throw err
    }

    if (req.body.accept === true) {
      const account = await Account.findOne({ _id: wageRequest.account._id }).exec()

      if (account === null) {
        const err = new Error('Wage Request account does not exist')
        err.code = 404

        throw err
      }

      if (account.wages.indexOf(wageRequest.wage._id) === -1) { // If wage not already added
        account.wages.push(wageRequest.wage._id)
        account.markModified('wages')

        await account.save()
      }
    }

    await WageRequest.remove({ _id: req.params.id }).exec()
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

router.get('/', middleware.ensureAdmin, findAll)
router.post('/:id', middleware.ensureAdmin, update)

module.exports = {
  router
}
