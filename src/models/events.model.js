import { Schema, SchemaTypes, model } from 'mongoose'

const EventSchema = new Schema(
    {
        _workspaceID: {
            type: SchemaTypes.ObjectId
        },
        code: {
            type: String,
            minlength: 4,
            maxlength: 10,
            unique: true,
            index: true,
            trim: true,
            required: true,
            uppercase: true,
        },
        name: {
            type: String,
            minlength: 8,
            maxlength: 120,
            required: true,
            trim: true,
        },
        details: {
            type: String,
        },
        open: {
            type: SchemaTypes.Date,
            required: true,
        },
        close: {
            type: SchemaTypes.Date,
            required: true,
        },
    },
    { versionKey: false, collection: 'events', timestamps: true },
)

export default model('Event', EventSchema)