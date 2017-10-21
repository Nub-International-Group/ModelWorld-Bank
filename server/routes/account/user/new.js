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
        if (document.users[req.body.newDocument.name] !== undefined) {
          delete document.users[req.body.newDocument.name]
        } else {
          return res.status(500).json({err: {code: 500, desc: 'You can\'t remove a user that doesn\'t exist'}})
        }
      }

      document.markModified('users')

      document.save(function (err, updatedDocument) {
        if (err) {
          return next(err)
        }

        return res.status(200).json(document)
      })
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}
