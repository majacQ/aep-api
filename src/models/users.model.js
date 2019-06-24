import { Schema, SchemaTypes, model } from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../config'

export const UserSchema = new Schema(
  {
    _workspaceID: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    _spotifyID: {
      type: String,
      index: true,
      unique: true,
      required: false,
    },
    firstName: {
      type: String,
      minlength: 4,
      maxlength: 100,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 4,
      maxlength: 120,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    dashboard: {
      type: Boolean,
      default: true,
    },
    spotify: {
      accessToken: {
        type: String,
        required: false,
      },
      refreshToken: {
        type: String,
        required: false,
      },
      expiresIn: {
        type: String,
        required: false,
      },
    },
  },
  { versionKey: false, timestamps: true },
)

UserSchema.pre('save', async function(next) {
  const user = this
  if (this.isModified('password')) {
    bcrypt.genSalt(config.get('SECURITY.SALT_ROUNDS'), (errSalt, salt) => {
      if (errSalt) return new Error(errSalt)
      bcrypt.hash(user.password, salt, (errHash, hash) => {
        if (errHash) return new Error(errHash)
        user.password = hash
      })
    })
  }
  next()
})

UserSchema.method('verify', function(password) {
  return new Promise((resolve, reject) => {
    // FIX: LOCALLY COMPARE TAKES ON AVERAGE 3500-5000ms
    bcrypt.compare(password, this.password, (err, same) => {
      if (err) reject(err)
      resolve(same)
    })
  })
})

export default model('User', UserSchema)
