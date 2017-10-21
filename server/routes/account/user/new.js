const Account = require('../../../models/account.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}).populate('wages').exec(function (err, document) {
    if (err) {
      return next(err)
    }

    if (document == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if ((document.users[req.decoded.name] === 3) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      console.log(req.body)
      req.body.newDocument.name = req.body.newDocument.name.toLowerCase()

      if (req.body.newDocument.name === req.decoded.name) {
        return res.status(500).json({err: {code: 500, desc: 'You can\'t adjust your own permissions'}})
      }

      let parsedLevel = parseInt(req.body.newDocument.level)
      if (isNaN(parsedLevel)) {
        return res.status(500).json({err: {code: 500, desc: 'Invalid level entry'}})
      }

      if (parsedLevel <= 3 && parsedLevel > 0) {
        document.users[req.body.newDocument.name] = parsedLevel // Create new property with name and level, or overwrite existing
      } else if (parsedLevel === 0) { // 0 -> Delete operation
        if (document.users[req.body.newDocument.name]) {
          delete document.users[req.body.newDocument.name]
        } else {
          return res.status(500).json({err: {code: 500, desc: 'You can\'t remove a user that doesn\'t exist'}})
        }
      }
      console.log(document.users)
      document.users['lee harvey'] = 3

      document.save(function (err, updatedDocument) {
        if (err) {
          return next(err)
        }
        console.log('ree')

        updatedDocument.calculateBalance(function (err, data) {
          if (err) { return next(err) }
          updatedDocument.balance = data.balance
          updatedDocument.transactions = data.transactions
          return res.status(200).json(document) // Send updated document to client
        })
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
