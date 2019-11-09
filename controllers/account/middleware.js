const Account = require('../../models/account.js')

const accountWithPerms = (permLevel) => {
  return async (req, res, next) => {
    try {
      const account = await Account.findOne({ _id: req.params.accountId }).populate('wages').exec()

      if (!account) {
        const e = new Error('account does not exist')
        e.statusCode = 404

        throw e
      }

      if (permLevel) {
        if (!(account.users[req.decoded.name] >= permLevel || req.decoded.admin === true)) {
          const e = new Error('You do not have permission to access this account')
          e.statusCode(403)

          throw e
        }
      }

      req.account = account
    } catch (e) {
      next(e)
    }
  }
}

module.exports = {
  accountWithPerms
}
