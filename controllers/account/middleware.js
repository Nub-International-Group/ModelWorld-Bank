const Account = require('../../models/account.js')

const fetchAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.params.accountId }).exec()

    req.account = account
    next()
  } catch (e) {
    return next(e)
  }
}

const accountWithPerms = (permLevel) => {
  return (req, res, next) => {
    try {
      const account = req.account

      if (!account) {
        const e = new Error('account does not exist')
        e.code = 404

        throw e
      }

      if (permLevel) {
        if (!(account.users[req.decoded.name] >= permLevel || req.decoded.admin === true)) {
          const e = new Error('You do not have permission to access this account')
          e.code = 403

          throw e
        }
      }
      next()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = {
  accountWithPerms,
  fetchAccount
}
