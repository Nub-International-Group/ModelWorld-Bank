const account = require('../../models/account.js')

module.exports = function (req, res, next) {
  let key = 'users.' + req.decoded.name // Build query with adaptive key
  let query = {}
  query[key] = {$gt: 0} // greater than zero has at least read access

  account.find(query).exec(function (err, documents) {
    if (err) {
      return next(err)
    }
    res.status(200).json(documents)
  })
}
