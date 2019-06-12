import { Schema, SchemaTypes, model } from 'mongoose'

const WorkspaceSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 8,
      maxlength: 200,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
  },
  { versionKey: false, collection: 'workspaces', timestamps: true },
)

export default model('Workspace', WorkspaceSchema)
