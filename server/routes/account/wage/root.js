const Account = require('../../../models/account.js')
const WageRequest = require('../../../models/wageRequest.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}).exec(function (err, document) {
    if (err) {
      return next(err)
    }

    if (document == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if ((document.users[req.decoded.name] >= 1) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      WageRequest.find({account: req.params.id}).populate('wage').exec(function (err, wageRequests) {
        if (err) {
          return next(err)
        }

        return res.status(200).json(wageRequests)
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
