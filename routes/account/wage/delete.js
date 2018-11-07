const Account = require('../../../models/account.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}).exec(function (err, document) {
    if (err) {
      return next(err)
    }

    if (document == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if ((document.users[req.decoded.name] === 3) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      let index = document.wages.indexOf(req.params.wageID)

      if (index > -1) {
        document.wages.splice(index, 1)
      }

      document.markModified('wages')

      document.save(function (err) {
        if (err) {
          return next(err)
        }

        return res.status(200).json({})
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
