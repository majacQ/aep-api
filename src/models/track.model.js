import { Schema, Types, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export const TrackSchema = new Schema(
  {
    _artistIDs: {
      type: [String],
      index: true,
    },
    _spotifyID: {
      type: String,
      index: true,
    },
    _deezerID: {
      type: Number,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    explicit: {
      type: Boolean,
      required: false,
    },
    spotifyPreview: {
      type: String,
    },
    deezerPreview: {
      type: String,
    },
    art: {
      spotify: [Map],
      deezer: [Map],
    },
  },
  { versionKey: false, collation: 'tracks', timestamps: true },
)

TrackSchema.plugin(paginate)

export default model('Tracks', TrackSchema)
