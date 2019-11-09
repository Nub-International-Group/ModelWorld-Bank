const router = (require('express')).Router()

const middleware = require('../middleware')

const updatePermission = async (req, res, next) => {
  try {
    const account = req.account

    req.body.newDocument.name = req.body.newDocument.name.toLowerCase()

    if (req.body.newDocument.name === req.decoded.name) {
      return res.status(500).json({ err: { code: 500, desc: 'You can\'t adjust your own permissions' } })
    }

    const parsedLevel = parseInt(req.body.newDocument.level)
    if (isNaN(parsedLevel)) {
      return res.status(500).json({ err: { code: 500, desc: 'Invalid level entry' } })
    }

    if (parsedLevel <= 3 && parsedLevel > 0) {
      account.users[req.body.newDocument.name] = parsedLevel // Create new property with name and level, or overwrite existing
    } else if (parsedLevel === 0) { // 0 -> Delete operation
      if (account.users[req.body.newDocument.name] !== undefined) {
        delete account.users[req.body.newDocument.name]
      } else {
        return res.status(500).json({ err: { code: 500, desc: 'You can\'t remove a user that doesn\'t exist' } })
      }
    }

    account.markModified('users')
    await account.save()

    res.status(200).json(account)
  } catch (e) {
    next(e)
  }
}

router.post('/', middleware.accountWithPerms(3), updatePermission)

module.exports = {
  router
}
