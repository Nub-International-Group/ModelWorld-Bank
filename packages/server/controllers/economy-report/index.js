const router = (require('express')).Router()

const EconomyReport = require('../../models/economy-report.js')

const getLatest = async (req, res, next) => {
  try {
    const currentSettings = await EconomyReport.findOne({}).sort({ monthsSinceEpoch: 'desc' }).exec()

    res.status(200).json(currentSettings)
  } catch (err) {
    next(err)
  }
}

const getAll = async (req, res, next) => {
  try {
    const economyReports = await EconomyReport.find({}).exec()

    res.status(200).json(economyReports)
  } catch (err) {
    next(err)
  }
}

router.get('/latest', getLatest)
router.get('/', getAll)

module.exports = {
  router
}
