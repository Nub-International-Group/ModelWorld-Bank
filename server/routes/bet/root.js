const Bet = require('../../models/bet.js')

module.exports = function (req, res, next) {
  Bet.find({}).exec(function (err, documents) {
    if (err) {
      return next(err)
    }

    return res.status(200).json(documents)
  })
}
