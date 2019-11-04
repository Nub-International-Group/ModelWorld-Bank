/*
  Deletes all wages from all accounts. Used after a general election.
*/

const Account = require('../../models/account.js')

module.exports = async (req, res, next) => {
  try {
    await Account.update({}, { wages: [] }, { multi: true }).exec()

    return res.status(204).end()
  } catch (err) {
    next(err)
  }
}
