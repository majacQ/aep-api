import { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export const ArtistSchema = new Schema(
  {
    _spotifyID: {
      type: String,
      index: true,
      unique: true,
    },
    _deezerID: {
      type: Number,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    pictures: {
      sm: {
        type: String,
      },
      md: {
        type: String,
      },
      lg: {
        type: String,
      },
      xl: {
        type: String,
      },
    },
  },
  { versionKey: false, collation: 'artists', timestamps: true },
)

ArtistSchema.plugin(paginate)

export default model('Artists', ArtistSchema)
