import { Schema, SchemaTypes, Types, model } from 'mongoose'
import Workspace from '../models/workspace.model'
import bcrypt from 'bcrypt'

const UserSchema = new Schema(
    {
        _workspaceID: {
            type: SchemaTypes.ObjectId
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
            required: true
        },
        password: {
            type: String,
            required: true,
        }
    },
    { versionKey: false, collection: 'users', timestamps: true },
)

UserSchema.pre('save', async function (next) {
    const user = this
    if(this.isModified('password')) user.password = await bcrypt.hashSync(user.password, 15)
    next()
})

UserSchema.methods.verify = function (password) {
    bcrypt.compare(password, this.password, (err, res) => {
        if (err) return new Error(err)
        return res
    })
}

export default model('User', UserSchema)