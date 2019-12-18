const mongoose = require('mongoose')
const config = require('config')
const logger = require('pino')()
const { Account } = require('./models')

mongoose.connect(config.mongoURL)
mongoose.Promise = Promise

mongoose.connection.on('error', function (err) {
  logger.fatal(err, 'error connecting to mongodb')

  process.exit(1)
})

const payAccounts = async () => {
  const accounts = await Account.find({ company: false }).populate('wages').exec()
  logger.info(`${accounts.length} accounts to process wages for.`)

  const promises = accounts.map(account => account.handlePaymentJob())

  return Promise.all(promises)
}

logger.info('starting account payment cron job')
payAccounts()
  .then(() => {
    logger.info('payment cron job completed')
    process.exit(0)
  })
  .catch(err => {
    logger.fatal(err, 'an error occured completing the payment cron job')
    process.exit(1)
  })
