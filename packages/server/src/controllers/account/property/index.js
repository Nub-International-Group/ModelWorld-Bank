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

async function transfer ({ body, property, decoded: user }, res, next) {
  try {
    if (!body.accountId) {
      const e = new Error('accountId must be specified.')
      e.code = 422

      throw e
    }

    if (body.accountId === property.owner) {
      const e = new Error('cannot transfer to self.')
      e.code = 422

      throw e
    }

    if (property.tags.includes('untransferrable')) {
      const e = new Error('This property cannot be traded.')
      e.code = 422

      throw e
    }

    let value = body.value
    if (typeof value !== 'number' || value < 0) {
      const e = new Error('A valid positive numerical value must be provided for the transfer')
      e.code = 422

      throw e
    }
    value = Number(value.toFixed(2))

    await property.update({
      owner: body.accountId,
      valuations: [
        ...property.valuations || [],
        {
          created: Date.now(),
          user: user.name,
          amount: value
        }
      ]
    }).exec()

    res.status(204).json({})
  } catch (e) {
    next(e)
  }
}

router.get('/', middleware.accountWithPerms(1), find)
router.post('/:propertyId/transfer', middleware.accountWithPerms(2), transfer)

router.param('propertyId', utils.generateParamMiddleware(Property, 'property'))

// Middleware to ensure property is owned by account
router.param('propertyId', (req, res, next) => {
  if (!req.property || !req.account) {
    const e = new Error('Property or account does not exist')
    e.code = 422
    return next(e)
  }

  if (req.property.owner !== req.account._id) {
    const e = new Error(`Property ${req.property._id} does not exist under account ${req.account.__id}`)
    e.code = 404

    return next(e)
  }
  next()
})

module.exports = {
  router
}
