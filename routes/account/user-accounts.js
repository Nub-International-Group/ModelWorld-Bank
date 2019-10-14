const Account = require('../../models/account.js')

module.exports = async function (req, res, next) {
  try {
    const key = 'users.' + req.decoded.name // Build query with adaptive key
    const query = {}
    query[key] = {$gt: 0} // greater than zero has at least read access

    const accounts = await Account.find(query).exec()

    return res.status(200).json(accounts)
  } catch (e) {
    next (e)
  }
}
