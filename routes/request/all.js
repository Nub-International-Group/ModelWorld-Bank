const WageRequest = require('../../models/wageRequest.js')
const Account = require('../../models/account.js')
const async = require('async')

function removeRequest (deepCallback, id) {
  WageRequest.remove({_id: id}, function (err) {
    if (err) {
      return deepCallback(err)
    }

    return deepCallback()
  })
}

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    WageRequest.find({}).populate('wage').populate('account').exec(function (err, wageRequests) {
      if (err) {
        return next(err)
      }

      if (wageRequests.length > 0) {
        async.each(wageRequests, function (wageRequest, deepCallback) {
          if (req.body.decision === false) { // Deny all
            return removeRequest(deepCallback, wageRequest._id)
          } else { // Accept All
            Account.findOne({_id: wageRequest.account._id}, function (err, account) {
              if (err) {
                return deepCallback(err)
              }

              if (account === null) {
                return removeRequest(deepCallback, wageRequest._id)
              }

              if (account.wages.indexOf(wageRequest.wage._id) === -1) { // If wage not already added
                account.wages.push(wageRequest.wage._id)
                account.markModified('wages')

                return account.save(function (err) {
                  if (err) {
                    return deepCallback(err)
                  }
                  return removeRequest(deepCallback, wageRequest._id)
                })
              } else {
                return removeRequest(deepCallback, wageRequest._id)
              }
            })
          }
        }, function (err) {
          if (err) {
            return next(err)
          }

          return res.status(200).json({})
        })
      } else {
        return res.status(404).json({err: {code: 404, desc: 'Document does not exist'}})
      }
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
