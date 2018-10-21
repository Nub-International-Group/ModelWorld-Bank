/*
  Deletes all wages from all accounts. Used after a general election.
*/

const Account = require('../../models/account.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    Account.update({}, {wages: []}, {multi: true}, function (err, document) {
      if (err) {
        return next(err)
      }

      return res.status(200).json({}) // Returns document with updated data
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
