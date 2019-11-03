const wage = require('../../models/wage.js')
const wageRoot = require('./root.js')

module.exports = async (req, res, next) => {
  try {
    const updatedDoc = await wage.findOneAndUpdate({'_id': req.params.id}, req.body).exec()

    if (!updatedDoc) {
      const err = new Error('Resource not found')
      err.code = 404

      throw err
    }

    return res.status(200).json(document)
  } catch (err) {
    next(err)
  }

}
