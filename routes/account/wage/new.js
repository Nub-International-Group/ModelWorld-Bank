const Account = require('../../../models/account.js')
const WageRequest = require('../../../models/wageRequest.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}).populate('wages').exec(function (err, document) {
    if (err) {
      return next(err)
    }

    if (document == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if ((document.users[req.decoded.name] === 3) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      let wageRequest = new WageRequest({
        account: req.params.id,
        wage: req.body.wageID,
        user: req.decoded.name
      })

      wageRequest.save(function (err) {
        if (err) {
          return next(err)
        }
        WageRequest.find({account: req.params.id}).populate('wage').exec(function (err, wageRequests) {
          if (err) {
            return next(err)
          }

          return res.status(200).json(wageRequests)
        })
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
