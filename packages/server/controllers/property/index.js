const router = (require('express')).Router()

const Property = require('../../models/property.js')

const middleware = require('../../middleware')
const utils = require('../../utils')

const create = async (req, res, next) => {
  delete req.body._id

  const initialValuation = req.body.initialValuation
  delete req.body.initialValuation
  try {
    const newProperty = await Property.create({
      ...req.body,
      valuations: [
        {
          amount: initialValuation,
          user: req.decoded.name
        }
      ]
    })

    res.status(200).json(newProperty)
  } catch (err) {
    next(err)
  }
}

const deleteById = async (req, res, next) => {
  try {
    await Property.remove({ _id: req.property._id }).exec()

    res.status(204).end()
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

const updateById = async (req, res, next) => {
  try {
    for (const field in req.body) {
      const value = req.body[field]

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
router.put('/:propertyId', middleware.ensureAdmin, updateById)
router.delete('/:propertyId', middleware.ensureAdmin, deleteById)
router.param('propertyId', utils.generateParamMiddleware(Property, 'property'))

module.exports = {
  router
}
