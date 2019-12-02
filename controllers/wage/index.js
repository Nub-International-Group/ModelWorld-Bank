const router = (require('express')).Router()

const middleware = require('../../middleware')

const Wage = require('../../models/wage.js')
const WageRequest = require('../../models/wage-request.js')
const Account = require('../../models/account.js')

const deleteById = async (req, res, next) => {
  try {
    await Wage.remove({ _id: req.params.id }).exec()
    await WageRequest.remove({ wage: req.params.id }).exec()

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

const create = async (req, res, next) => {
  try {
    req.body.newDocument.value = Number(req.body.newDocument.value)

    if (isNaN(req.body.newDocument.value)) {
      throw new Error('Invalid Data Entry')
    }

    const wage = await Wage.create(req.body.newDocument)
    res.status(200).json(wage)
  } catch (err) {
    next(err)
  }
}

const purgeWages = async (req, res, next) => {
  try {
    await Account.update({}, { wages: [] }, { multi: true }).exec()

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

const findAll = async (req, res, next) => {
  try {
    const wages = await Wage.find({}).exec()

    res.status(200).json(wages)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const updatedDoc = await Wage.findOneAndUpdate({ _id: req.params.id }, req.body).exec()

    if (!updatedDoc) {
      const err = new Error('Resource not found')
      err.code = 404

      throw err
    }

    res.status(200).json(document)
  } catch (err) {
    next(err)
  }
}

router.get('/', findAll)
router.post('/', middleware.ensureAdmin, create)
router.put('/:id', middleware.ensureAdmin, update)
router.delete('/:id', middleware.ensureAdmin, deleteById)
router.post('/purge', middleware.ensureAdmin, purgeWages) // Handles post GE wipe of wages

module.exports = {
  create,
  deleteById,
  purgeWages,
  findAll,
  update,
  router
}
