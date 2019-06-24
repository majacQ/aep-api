import { Schema, SchemaTypes } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export const ArtistSchema = new Schema(
  {
    _spotifyID: {
      type: String,
      index: true,
    },
    _discogsID: {
      type: Number,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  { versionKey: false, collation: 'track', timestamps: true },
)

ArtistSchema.plugin(paginate)

export default model('Artists', ArtistSchema)
