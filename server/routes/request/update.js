const WageRequest = require('../../models/wageRequest.js')
const Account = require('../../models/account.js')

function removeRequest (req, res, next) {
  WageRequest.remove({_id: req.params.id}, function (err) {
    if (err) {
      return next(err)
    }

    return res.status(200).json({})
  })
}

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    WageRequest.findOne({_id: req.params.id}).populate('wage').populate('account').exec(function (err, wageRequest) {
      if (err) {
        return next(err)
      }

      if (wageRequest === null) {
        return res.status(404).json({err: {code: 404, desc: 'Wage Request does not exist'}})
      }

      if (req.body.accept === true) {
        Account.findOne({_id: wageRequest.account._id}, function (err, account) {
          if (err) {
            return next(err)
          }

          if (account === null) {
            return res.status(404).json({err: {code: 404, desc: 'Target account does not exist'}})
          }

          if (account.wages.indexOf(wageRequest.wage._id) === -1) { // If wage not already added
            account.wages.push(wageRequest.wage._id)
            account.markModified('wages')

            return account.save(function (err) {
              if (err) {
                return next(err)
              }
              return removeRequest(req, res, next)
            })
          } else {
            return removeRequest(req, res, next)
          }
        })
      } else {
        return removeRequest(req, res, next)
      }
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
