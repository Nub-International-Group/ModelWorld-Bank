const Wager = require('../../models/wager.js')

module.exports = function (req, res, next) {
  Wager.find({account: req.params.id}).populate('bet').exec(function (err, documents) {
    if (err) {
      return next(err)
    }

    console.log(documents)

    return res.status(200).json(documents)
  })
}
