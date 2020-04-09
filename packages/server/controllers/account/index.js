const router = (require('express')).Router()

const Account = require('../../models/account.js')

const middleware = {
  ...require('../../middleware'),
  ...require('./middleware')
}
const subControllers = {
  property: require('./property'),
  transaction: require('./transaction'),
  wage: require('./wage'),
  user: require('./user'),
  wager: require('./wager')
}

const utils = require('../../utils')

const findAll = require('./find-all')

async function findById (req, res, next) {
  try {
    res.status(200).json(req.account)
  } catch (e) {
    next(e)
  }
}

async function create (req, res, next) {
  try {
    const owner = req.body.owner
    delete req.body.owner
    delete req.body._id

    const newAccount = await Account.create({
      ...req.body,
      users: {
        [owner.toLowerCase()]: 3
      }
    })

    res.status(200).json(newAccount)
  } catch (e) {
    next(e)
  }
}

async function deleteById (req, res, next) {
  try {
    await Account.remove({ _id: req.params.accountId })

    res.status(204).json({})
  } catch (e) {
    next(e)
  }
}

async function patchById (req, res, next) {
  try {
    const account = req.account

    for (const property in req.body) {
      account[property] = req.body[property]
    }

    await account.save()

    res.status(200).json(account)
  } catch (e) {
    next(e)
  }
}

function payWagesPromisified (account) {
  return new Promise((resolve, reject) => {
    account.payWages((err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

async function triggerWagePayment (req, res, next) {
  try {
    await payWagesPromisified(req.account)

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

router.get('/', findAll)
router.post('/', middleware.ensureAdmin, create)
router.get('/:accountId', middleware.accountWithPerms(1), findById)
router.delete('/:accountId', middleware.ensureAdmin, deleteById)
router.put('/:accountId', middleware.ensureAdmin, patchById)
router.post('/:accountId/pay', middleware.ensureAdmin, triggerWagePayment)

router.use('/:accountId/transactions', subControllers.transaction.router)
router.use('/:accountId/wages', subControllers.wage.router)
router.use('/:accountId/users', subControllers.user.router)
router.use('/:accountId/wagers', subControllers.wager.router)
router.use('/:accountId/properties', subControllers.property.router)

router.param('accountId', utils.generateParamMiddleware(Account, 'account'))

module.exports = {
  router
}
