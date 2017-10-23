const WageRequest = require('../../models/wageRequest.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    WageRequest.find({}).populate('wage').populate('account').exec(function (err, documents) {
      if (err) {
        return next(err)
      }
      return res.status(200).json(documents)
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }

}
