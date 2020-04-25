const mongoose = require('mongoose')
const config = require('config')
const logger = require('pino')({
  name: 'payment-cron',
  level: process.env.LOG_LEVEL || 'info'
})
const { Account, EconomyReport } = require('./models')
const { nubMonthsSinceEpoch } = require('./utils/nub-epoch')

mongoose.connect(config.mongoURL)
mongoose.Promise = Promise

mongoose.connection.on('error', function (err) {
  logger.fatal(err, 'error connecting to mongodb')

  process.exit(1)
})

const payAccounts = async () => {
  const accounts = await Account.find({}).exec()
  logger.info(`${accounts.length} accounts to process wages for.`)

  for (const account of accounts) {
    await account.handlePaymentJob()
    logger.info(`account ${account._id} paid`)
  }
}

const run = async () => {
  const monthsSinceEpoch = nubMonthsSinceEpoch()
  logger.info('%d months since epoch', monthsSinceEpoch)

  const wagesProcessed = await EconomyReport.exists({
    monthsSinceEpoch
  })
  if (!wagesProcessed) {
    await payAccounts()
  }

  await EconomyReport.generateReport()
}

logger.info('starting update cron job')
run()
  .then(() => {
    logger.info('update cron job completed')
    process.exit(0)
  })
  .catch(err => {
    logger.fatal(err, 'an error occured completing the update cron job')
    process.exit(1)
  })
