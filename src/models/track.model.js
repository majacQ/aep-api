import { Schema, Types } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { ArtistSchema } from './artist.model'

export const TrackSchema = new Schema(
  {
    _artistIDs: [
      {
        type: ArtistSchema,
      },
    ],
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
      unique: true,
    },
  },
  { versionKey: false, collation: 'track', timestamps: true },
)

TrackSchema.plugin(paginate)

export default model('Tracks', TrackSchema)
