const router = (require('express')).Router()

const AccountType = require('../../models/account-type.js')

const middleware = require('../../middleware')
const utils = require('../../utils')

const create = async (req, res, next) => {
  try {
    const newAccountType = await AccountType.create({
      ...req.body
    })

    res.status(200).json(newAccountType)
  } catch (err) {
    next(err)
  }
}

const findAll = async (req, res, next) => {
  try {
    const accountTypes = await AccountType.find({}).exec()
    res.status(200).json(accountTypes)
  } catch (e) {
    next(e)
  }
}

const updateById = async (req, res, next) => {
  try {
    const accountType = await AccountType.findOneAndUpdate({ _id: req.params.accountTypeId }, req.body).exec()

    if (!accountType) {
      const err = new Error('Resource not found')
      err.code = 404

      throw err
    }

    res.status(200).json(accountType)
  } catch (err) {
    next(err)
  }
}

router.get('/', findAll)
router.post('/', middleware.ensureAdmin, create)
router.put('/:accountTypeId', middleware.ensureAdmin, updateById)

router.param('accountTypeId', utils.generateParamMiddleware(AccountType, 'accountType'))

module.exports = {
  router
}
