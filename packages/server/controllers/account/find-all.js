const Account = require('../../models/account')

module.exports = async function (req, res, next) {
  try {
    if (req.query.admin !== undefined) {
      if (req.decoded.admin === true) {
        const accounts = await Account.find({}).exec()

        return res.status(200).json(accounts)
      } else {
        return res.status(403).json({ err: { code: 403, desc: 'You do not have permission' } })
      }
    }

    if (req.query.typeahead !== undefined) {
      const accounts = await Account.find({}, 'name description _id').exec()

      return res.status(200).json(accounts)
    }
  } catch (err) {
    next(err)
  }
}
