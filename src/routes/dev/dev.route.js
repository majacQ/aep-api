import express from 'express'
import config from '../../config'
import Event from '../../models/events.model'
import User from '../../models/users.model'
import Workspace from '../../models/workspace.model'
import Request from '../../models/requests.model'

import workspaceArray from '../../mocks/workspaces.mock'
import userArray from '../../mocks/users.mock'
import eventsArray from '../../mocks/events.mock'

const dev = express.Router()

dev.get('/populate', (req, res, next) => {
  Workspace.deleteMany({}).catch((err) => {
    throw new Error(err)
  })
  User.deleteMany({}).catch((err) => {
    throw new Error(err)
  })
  Event.deleteMany({}).catch((err) => {
    throw new Error(err)
  })

  Workspace.insertMany(workspaceArray).catch((err) => {
    throw new Error(err)
  })
  User.create(userArray).catch((err) => {
    throw new Error(err)
  })
  Event.insertMany(eventsArray).catch((err) => {
    throw new Error(err)
  })

  res.json({ success: true })
})

export default dev
