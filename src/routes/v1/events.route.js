import express from 'express'
import controller from '../../controllers/events.controller'
const events = express.Router()

events.get('/', async (req, res, next) => {
  return await controller.GetEvents(req, res, next)
})

export default events
