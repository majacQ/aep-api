import { Schema, SchemaTypes, Types, model } from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../config'

const UserSchema = new Schema(
  {
    _workspaceID: {
      type: SchemaTypes.ObjectId,
    },
    firstName: {
      type: String,
      minlength: 4,
      maxlength: 100,
      trim: true,
    },
    lastName: {
      type: String,
      minlength: 4,
      maxlength: 120,
      trim: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, collection: 'users', timestamps: true },
)

UserSchema.pre('save', async function(next) {
  const user = this
  if (this.isModified('password')) {
    bcrypt.genSalt(config.get('SECURITY.SALT_ROUNDS'), (errSalt, salt) => {
      if (errSalt) return new Error(errSalt)
      bcrypt.hash(user.password, salt, (errHash, hash) => {
        if (err) return new Error(errHash)
        user.password = hash
      })
    })
  }
  next()
})

UserSchema.methods.verify = function(password) {
  bcrypt.compare(password, this.password, (err, res) => {
    if (err) return new Error(err)
    return res
  })
}

export default model('User', UserSchema)
