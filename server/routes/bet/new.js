const Bet = require('../../models/bet.js')

module.exports = function (req, res, next) {
  if (req.decoded.admin === true) {
    let statuses = ['Closed', 'Open', 'Paid']
    req.body.status = statuses.indexOf(req.body.status)

    if (req.body.status == -1) {
      return res.status(500).json({err: {code: 500, desc: 'Invalid data entry, Status invalid...'}})
    }

    let newBet = new Bet({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status
    })

    req.body.options.forEach((element) => {
      if (isNaN(element.currentOdds) == false) {
        element.currentOdds = parseFloat(element.currentOdds)
      } else {
        return res.status(500).json({err: {code: 500, desc: 'Invalid data entry, Odds must be a number...'}})
      }

      newBet.options.push(element)
    })

    newBet.markModified('options')

    newBet.save(function (err) {
      if (err) {
        return next(err)
      }

      return res.status(200).json(newBet)
    })
  } else {
    return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
  }
}
