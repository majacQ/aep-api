import { Schema, SchemaTypes, model } from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../config'

const UserSchema = new Schema(
  {
    _workspaceID: {
      type: SchemaTypes.ObjectId,
      required: true,
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

UserSchema.statics.verify = async function(password) {
  await bcrypt.compare(password, this.password, (err, res) => {
    if (err) return new Error(err)
    return res
  })
}

export default model('User', UserSchema)
