const Wager = require('../../models/wager.js')

module.exports = function (req, res, next) {
  Wager.find({bet: req.params.id}).exec(function (err, documents) {
    if (err) {
      return next(err)
    }

    return res.status(200).json(documents)
  })
}
