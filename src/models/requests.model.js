import { Schema, SchemaTypes } from 'mongoose'

const RequestSchema = new Schema(
    {
        _eventID: {
            type: SchemaTypes.ObjectId,
            required: true,
            index: true,
        },
        song: {
            type: SchemaTypes.ObjectId,
            required: true,
        },
        played: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { versionKey: false, collection: 'requests', timestamps: true },
)
