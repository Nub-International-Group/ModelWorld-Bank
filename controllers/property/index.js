const router = (require('express')).Router()

const Property = require('../../models/property.js')

const middleware = require('../../middleware')
const utils = require('../../utils')

const create = async (req, res, next) => {
  try {
    const newProperty = await Property.create({
      ...req.body
    })

    res.status(200).json(newProperty)
  } catch (err) {
    next(err)
  }
}

const findAll = async (req, res, next) => {
  try {
    const properties = await Property.find({}).exec()
    res.status(200).json(properties)
  } catch (e) {
    next(e)
  }
}

const whitelistedFieldsForUpdate = ['fields here']
const updateById = async (req, res, next) => {
  try {
    for (const field in req.body) {
      const value = req.body[field]
      if (!whitelistedFieldsForUpdate.includes(field)) {
        const e = new Error('Forbidden to modify protected field')
        e.code = 403

        throw e
      }

      req.property[field] = value
    }

    await req.property.save()

    res.status(200).json(req.property)
  } catch (err) {
    next(err)
  }
}

router.get('/', findAll)
router.post('/', middleware.ensureAdmin, create)
router.put('/:propertyId', updateById)

router.param('propertyId', utils.generateParamMiddleware(Property, 'property'))

module.exports = {
  router
}
