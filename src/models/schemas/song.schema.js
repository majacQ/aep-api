import { Schema, SchemaTypes } from 'mongoose'

const SongSchema = new Schema({
    _artistIDs: [
        {
            type: SchemaTypes.ObjectId,
        },
    ],
    _albumIDs: [
        {
            type: SchemaTypes.ObjectId,
        },
    ],
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
})
