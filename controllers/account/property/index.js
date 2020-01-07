const router = (require('express')).Router()

const Property = require('../../../models/property')

const middleware = require('../middleware')

async function find (req, res, next) {
  try {
    const properties = await Property.find({ owner: req.account._id }).exec()

    res.status(200).json(properties)
  } catch (e) {
    next(e)
  }
}

router.get('/', middleware.accountWithPerms(), find)

module.exports = {
  router
}
