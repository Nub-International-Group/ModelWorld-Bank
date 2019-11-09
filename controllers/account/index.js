const router = (require('express')).Router()

const Account = require('../../models/account.js')

const controllers = require('../index')
const middleware = require('../../middleware')

const findAll = require('./find-all')

const findById = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.params.id }).populate('wages').exec()

    if (!account) {
      const e = new Error('account does not exist')
      e.statusCode = 404

      throw e
    }

    if (!(account.users[req.decoded.name] >= 1 || req.decoded.admin === true)) {
      const e = new Error('You do not have permission to access this account')
      e.statusCode(403)

      throw e
    }

    res.status(200).json(account)
  } catch (e) {
    next(e)
  }
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
    await Account.remove({ _id: req.params.id })

    res.status(204).json({})
  } catch (e) {
    next(e)
  }
}

const updateById = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.params.id }).populate('wages').exec()

    if (account === null) {
      const e = new Error('Resource not found')
      e.statusCode = 404

      throw e
    }

    if (!(document.users[req.decoded.name] >= 2 || req.decoded.admin === true)) {
      const e = new Error('You do not have permissions')
      e.statusCode = 403

      throw e
    }

    for (const property in req.body.changes) {
      if (req.body.changes.hasOwnProperty(property)) {
        const possibleFields = ['description', 'public']

        if (possibleFields.includes(property)) {
          document[property] = req.body.changes[property]
        }
      }
    }

    await document.save()
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
    const account = await Account.findOne({ _id: req.params.id }).populate('wages').exec()

    if (account === null) {
      const e = new Error('Resource not found')
      e.statusCode = 404

      throw e
    }

    await payWagesPromisified(account)

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

router.get('/', findAll)
router.post('/', middleware.ensureAdmin, create)
router.get('/:id', findById)
router.delete('/:id', deleteById)
router.post('/:id', updateById)
router.post('/:id/pay', middleware.ensureAdmin, triggerWagePayment)

// TODO: Rewrite sub controllers or delegate these to the controllers for the related object
router.get('/:id/wagers', controllers.wager.findByAccount)
router.post('/:id/users', require('./user/new.js'))

router.get('/:id/wages', require('./wage/root.js'))
router.post('/:id/wages', require('./wage/new.js'))
router.delete('/:id/wages/:wageID', require('./wage/delete.js'))

router.get('/:id/transactions', require('./transaction/root.js'))
router.post('/:id/transactions', require('./transaction/new.js'))

module.exports = {
  router
}
