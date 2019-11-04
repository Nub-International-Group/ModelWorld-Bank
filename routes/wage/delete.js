const wage = require('../../models/wage.js')
const wageRequest = require('../../models/wageRequest.js')
const wageRoot = require('./root.js')

module.exports = async (req, res, next) => {
  try {
    await wage.remove({ '_id': req.params.id })
    await wageRequest.remove({ 'wage': req.params.id })

    return res.status(204).end()
  } catch (err) {
    next(err)
  }
}
