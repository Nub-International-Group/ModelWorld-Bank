const Bet = require('../../models/bet.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    let newBet = new Bet({
      name: req.body.newDocument.name,
      description: req.body.newDocument.description,
      public: (req.body.newDocument.public === 'true'), // Simple logical check to convert. We can roughly trust admin data.
      verified: true,
      users: {}
    })

    newAccount.users[req.body.newDocument.owner.toLowerCase()] = 3 // Set owner

    newAccount.save(function (err) {
      if (err) {
        return next(err)
      }

      return res.status(200).json(newAccount)
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
