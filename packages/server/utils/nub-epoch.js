const NUB_EPOCH_IRL = '2020-04-26T18:00:00Z' // The time at which January 0000 Year Of Our Lord Halifax, Padanub, Began
const MONTH_PERIOD_IRL = 1000 * 60 * 60 * 24 * 3

const NUB_EPOCH_STAMP = (new Date(NUB_EPOCH_IRL)).valueOf()

const nubMonthsSinceEpoch = () => {
  const msPassed = Date.now() - NUB_EPOCH_STAMP

  return Math.floor(msPassed / MONTH_PERIOD_IRL)
}

module.exports = {
  nubMonthsSinceEpoch
}
