const router = (require('express')).Router()

const middleware = require('../../middleware')

const Transaction = require('../../models/transaction.js')

const deleteById = async (req, res, next) => {
  try {
    await Transaction.remove({ _id: req.params.id }).exec()

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

const findAll = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({}).exec()

    res.status(200).json(transactions)
  } catch (err) {
    next(err)
  }
}

router.get('/', middleware.ensureAdmin, findAll)
router.delete('/:id', middleware.ensureAdmin, deleteById)

module.exports = {
  deleteById,
  router
}
