import * as mongoose from 'mongoose'
import * as shortid from 'shortid' // smarter, shorter IDs than the default MongoDB ones

export interface IWage extends mongoose.Document {
  _id: string
  currency: string
  description: string
  name: string
  value: number
}

const schema = new mongoose.Schema({
  _id: { default: shortid.generate, type: String },
  currency: String,
  description: String,
  name: String,
  value: Number
}, { collection: 'wages' })

export default mongoose.model<IWage>('Wage', schema)
