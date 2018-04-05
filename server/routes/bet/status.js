const Bet = require('../../models/bet.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    Bet.findById(req.body.id).exec().then((bet) => {
      if (bet) {
        let statuses = ['Closed', 'Open', 'Paid']
        req.body.status = statuses.indexOf(req.body.status)

        if (req.body.status == -1) {
          return res.status(500).json({err: {code: 500, desc: 'Invalid data entry, Status invalid...'}})
        }

      } else {
        throw new Error(404)
      }
    }).catch((err) => {
      return res.status(500).json({err: {code: 500, desc: 'Something went wrong.'}})
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
