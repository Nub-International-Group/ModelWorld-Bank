const Account = require('../../models/account.js')

module.exports = function (req, res, next) {
  Account.find({}, 'name description _id').exec(function (err, accounts) {
    if (err) {
      return next(err)
    }

    if (accounts.length == 0) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }


    return res.status(200).json(accounts)
  })
}
