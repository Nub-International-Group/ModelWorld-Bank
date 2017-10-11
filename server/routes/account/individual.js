const account = require('../../models/account.js')

module.exports = function (req, res, next) {
  account.findOne({'_id': req.params.id}).populate('wages').exec(function (err, document) {
    if (err) {
      return next(err)
    }

    if (document == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if ((document.users[req.decoded.name] >= 1) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      document.calculateBalance(function (err, data) {
        if (err) { return next(err) }
        document.balance = data.balance
        document.transactions = data.transactions
        console.log(document)

        return res.status(200).json(document)
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
