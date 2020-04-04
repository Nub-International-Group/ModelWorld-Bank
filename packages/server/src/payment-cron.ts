import * as config from 'config'
import * as mongoose from 'mongoose'
import * as pino from 'pino'

import { Account } from './models'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  name: 'payment-cron'
})

mongoose.connect(config.get('mongoURL'))

mongoose.connection.on('error', err => {
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
