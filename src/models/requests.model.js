import { Schema, Types, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const RequestSchema = new Schema(
  {
    _workspaceID: {
      type: Types.ObjectId,
      required: true,
      index: true,
    },
    _eventID: {
      type: Types.ObjectId,
      required: true,
      index: true,
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
