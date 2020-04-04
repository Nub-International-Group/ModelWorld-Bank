import * as mongoose from 'mongoose'
import * as shortid from 'shortid'

import { IAccount } from './account'

export interface ITransaction extends mongoose.Document {
  _id: string
  amount: number
  authoriser: string
  created: Date
  currency: string
  description: string
  from: IAccount | string
  meta: any
  to: IAccount | string
  type: string
}

const schema = new mongoose.Schema({
  _id: { default: shortid.generate, type: String },
  amount: Number,
  authoriser: String,
  created: { default: Date.now, type: Date },
  currency: String,
  description: String,
  from: { ref: 'Account', type: String },
  meta: Object,
  to: { ref: 'Account', type: String },
  type: {
    enum: ['INCOME', 'INTEREST', 'TRANSFER', 'WAGER_PLACED', 'WAGER_PAYOUT', 'MISC'],
    type: String
  }
}, { collection: 'transactions' })

export default mongoose.model<ITransaction>('Transaction', schema)
