const router = (require('express')).Router()

const Account = require('../../models/account.js')

const middleware = {
  ...require('../../middleware'),
  ...require('./middleware')
}
const subControllers = {
  transaction: require('./transaction'),
  wage: require('./wage'),
  user: require('./user'),
  wager: require('./wager')
}

const findAll = require('./find-all')

const findById = async (req, res) => {
  res.status(200).json(req.account)
}

const create = async (req, res, next) => {
  try {
    const newAccount = await Account.create({
      name: req.body.newDocument.name,
      description: req.body.newDocument.description,
      public: (req.body.newDocument.public === 'true'), // Simple logical check to convert. We can roughly trust admin data.
      verified: true,
      company: (req.body.newDocument.company === 'true'),
      users: {
        [req.body.newDocument.owner.toLowerCase()]: 3
      }
    })

    res.status(200).json(newAccount)
  } catch (e) {
    next(e)
  }
}

const deleteById = async (req, res, next) => {
  try {
    await Account.remove({ _id: req.params.accountId })

    res.status(204).json({})
  } catch (e) {
    next(e)
  }
}

const updateById = async (req, res, next) => {
  try {
    const account = req.account

    for (const property in req.body.changes) {
      if (req.body.changes.hasOwnProperty(property)) {
        const possibleFields = ['description', 'public']

        if (possibleFields.includes(property)) {
          account[property] = req.body.changes[property]
        }
      }
    }

    await account.save()
  } catch (e) {
    next(e)
  }
}

const payWagesPromisified = (account) => {
  return new Promise((resolve, reject) => {
    account.payWages((err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

const triggerWagePayment = async (req, res, next) => {
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
router.delete('/:accountId', deleteById)
router.post('/:accountId', middleware.accountWithPerms(2), updateById)
router.post('/:accountId/pay', middleware.ensureAdmin, middleware.accountWithPerms(), triggerWagePayment)

router.use('/:accountId/transactions', subControllers.transaction.router)
router.use('/:accountId/wages', subControllers.wage.router)
router.use('/:accountId/users', subControllers.user.router)
router.use('/:accountId/wagers', subControllers.wager.router)

router.param('accountId', middleware.fetchAccount)

module.exports = {
  router
}
