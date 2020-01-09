const router = (require('express')).Router()

const Property = require('../../../models/property')

const utils = require('../../../utils')
const middleware = require('../middleware')

async function find (req, res, next) {
  try {
    const properties = await Property.find({ owner: req.account._id }).exec()

    res.status(200).json(properties)
  } catch (e) {
    next(e)
  }
}

async function sell ({ body, property, decoded: user }, res, next) {
  try {
    if (!body.accountId) {
      const e = new Error('accountId must be specified.')
      e.code = 422

      throw e
    }

    let value = body.value
    if (typeof value !== 'number' || value < 0) {
      const e = new Error('A valid positive numerical value must be provided for the sale')
      e.code = 422

      throw e
    }
    value = Number(value.toFixed(2))

    const updated = await property.update({
      owner: body.accountId,
      valuations: [
        ...property.valuations || [],
        {
          created: Date.now(),
          user: user.name
        }
      ]
    }).exec()

    res.status(200).json(updated)
  } catch (e) {
    next(e)
  }
}

router.get('/', middleware.accountWithPerms(1), find)
router.post('/sell', middleware.accountWithPerms(2), sell)

router.param('propertyId', utils.generateParamMiddleware(Property, 'property'))
module.exports = {
  router
}
