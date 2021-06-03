import express from 'express'
import config from '../../config'
import Event from '../../models/events.model'
import User from '../../models/users.model'
import Workspace from '../../models/workspace.model'
import Request from '../../models/requests.model'
import Artist from '../../models/artist.model'
import Track from '../../models/track.model'

import workspaceArray from '../../mocks/workspaces.mock'
import userArray from '../../mocks/users.mock'
import artistArray from '../../mocks/artists.mock'
import trackArray from '../../mocks/tracks.mock'
import requestArray from '../../mocks/requests.mock'
import eventsArray from '../../mocks/events.mock'

const dev = express.Router()

dev.get('/populate', async (req, res, next) => {
  await Workspace.deleteMany({}).catch((err) => {
    throw new Error(err)
  })
  await User.deleteMany({}).catch((err) => {
    throw new Error(err)
  })
  await Track.deleteMany({}).catch((err) => {
    throw new Error(err)
  })
  await Artist.deleteMany({}).catch((err) => {
    throw new Error(err)
  })
  await Request.deleteMany({}).catch((err) => {
    throw new Error(err)
  })
  await Event.deleteMany({}).catch((err) => {
    throw new Error(err)
  })

  await Workspace.insertMany(workspaceArray).catch((err) => {
    throw new Error(err)
  })
  await User.create(userArray).catch((err) => {
    throw new Error(err)
  })
  await Artist.insertMany(artistArray).catch((err) => {
    throw new Error(err)
  })
  await Track.insertMany(trackArray).catch((err) => {
    throw new Error(err)
  })
  await Event.insertMany(eventsArray).catch((err) => {
    throw new Error(err)
  })
  await Request.insertMany(requestArray).catch((err) => {
    throw new Error(err)
  })

  res.json({ success: true })
})

export default dev
