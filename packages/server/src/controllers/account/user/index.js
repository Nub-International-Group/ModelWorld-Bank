const router = (require('express')).Router()

const middleware = require('../middleware')

async function updatePermission (req, res, next) {
  try {
    const account = req.account
    const parsedLevel = parseInt(req.body.level)
    const username = req.params.username.toLowerCase()

    if (isNaN(parsedLevel)) {
      const e = new Error('Invalid permission level provided')
      e.code = 422

      throw e
    }

    if (req.decoded.username === username && !req.decoded.admin) {
      const e = new Error('You can\'t adjust your own permissions!')
      e.code = 403

      throw e
    }

    if (parsedLevel <= 3 && parsedLevel > 0) {
      account.users[username] = parsedLevel // Create new property with name and level, or overwrite existing
    } else if (parsedLevel === 0) { // 0 -> Delete operation
      delete account.users[username]
    }

    account.markModified('users')
    await account.save()

    res.status(200).json(account)
  } catch (e) {
    next(e)
  }
}

router.put('/:username', middleware.accountWithPerms(3), updatePermission)

module.exports = {
  router
}
