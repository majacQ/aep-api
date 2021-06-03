import { Schema, Types, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export const TrackSchema = new Schema(
  {
    // POSSIBLE REDESIGN TO JUST MAP THE ARTIST ID AND NAME
    // TO REDUCE DATABASE CALLs. IT ALSO WOULD REDUCE THE SIZE
    // OF THE LocalSearch METHOD POSSIBLY MAKING THE RESULTS
    // RETURN FASTER WITH LESS PROCESING
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
      spotify: {
        type: [Map],
        default: undefined,
      },
      deezer: {
        type: [Map],
        default: undefined,
      },
    },
  },
  { versionKey: false, collection: 'tracks', timestamps: true },
)

TrackSchema.plugin(paginate)

export default model('Tracks', TrackSchema)
