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



const payAccounts = async (monthsSinceEpoch) => {
  const accounts = await Account.find().where('paidOnDate.' + monthsSinceEpoch).exists(false).exec()
  logger.info(`${accounts.length} accounts to process wages for.`)

  for (const account of accounts) {
    await account.handlePaymentJob(monthsSinceEpoch)
    logger.info(`account ${account._id} paid`)
  }
}

const run = async () => {
  const monthsSinceEpoch = nubMonthsSinceEpoch()
  logger.info('%d months since epoch', monthsSinceEpoch)

  await payAccounts(monthsSinceEpoch)
  await EconomyReport.generateReport(monthsSinceEpoch)
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
