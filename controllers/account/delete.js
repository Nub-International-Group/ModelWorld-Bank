const account = require('../../models/account.js')

module.exports = async (req, res, next) => {
  try {
    if (req.decoded.admin === true) { await account.remove({ '_id': req.params.id }) }

    res.status(204).json({})
  } catch (e) {
    next(e)
  }
}
