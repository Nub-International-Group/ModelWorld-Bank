const router = (require('express')).Router()

const AccountType = require('../../models/account-type.js')

const middleware = require('../../middleware')
const utils = require('../../utils')

async function create (req, res, next) {
  try {
    delete req.body._id
    const newAccountType = await AccountType.create({
      ...req.body
    })

    res.status(200).json(newAccountType)
  } catch (err) {
    next(err)
  }
}

async function find (req, res, next) {
  try {
    const accountTypes = await AccountType.find({}).exec()
    res.status(200).json(accountTypes)
  } catch (e) {
    next(e)
  }
}

async function patchById (req, res, next) {
  try {
    for (const field in req.body) {
      req.accountType[field] = req.body[field]
    }

    await req.accountType.save()

    res.status(200).json(req.accountType)
  } catch (err) {
    next(err)
  }
}

router.get('/', find)
router.post('/', middleware.ensureAdmin, create)
router.put('/:accountTypeId', middleware.ensureAdmin, patchById)

router.param('accountTypeId', utils.generateParamMiddleware(AccountType, 'accountType'))

module.exports = {
  router
}
