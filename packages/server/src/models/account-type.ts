import * as mongoose from 'mongoose'
import * as shortid from 'shortid' // smarter, shorter IDs than the default MongoDB ones

export interface IAccountType extends mongoose.Document {
  id: string
  description: string
  name: string
  options: {
    betting: boolean
    interest: {
      mechanism: string
      rate: number
    }
    property: boolean
    salary: boolean
    transactionFee: {
      mechanism: string
      rate: number
    }
  }
}

const schema = new mongoose.Schema({
  _id: {
    default: shortid.generate,
    type: String
  },
  description: String,
  name: String,
  options: {
    betting: Boolean,
    interest: {
      mechanism: {
        enum: ['percentage'],
        type: String
      },
      rate: Number
    },
    property: Boolean,
    salary: Boolean,
    transactionFee: {
      mechanism: {
        enum: ['percentage'],
        type: String
      },
      rate: Number
    }
  }
}, { collection: 'account-types' })

export default mongoose.model<IAccountType>('AccountType', schema)
