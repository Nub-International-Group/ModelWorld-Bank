const Account = require('../../../models/account.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}).exec(function (err, account) {
    if (err) {
      return next(err)
    }

    if (account == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if ((account.users[req.decoded.name] >= 1) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      account.calculateBalance().then((data) => {
        return res.status(200).json(data)
      }).catch(next)
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
