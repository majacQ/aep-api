import { Schema, Types } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const RequestSchema = new Schema(
  {
    _eventID: {
      type: Types.ObjectId,
      required: true,
      index: true,
    },
    _artistID: {
      type: Types.ObjectId,
      required: true,
    },
    _trackID: {
      type: Types.ObjectId,
      required: true,
    },
    played: {
      type: Boolean,
      default: true,
    },
    request_count: {
      type: Number,
      default: 1,
    },
  },
  { versionKey: false, collection: 'requests', timestamps: true },
)

RequestSchema.plugin(paginate)

export default model('Requests', RequestSchema)
