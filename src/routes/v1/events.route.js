import express from 'express'
import controller from '../../controllers/events.controller'

const events = express.Router()

events.get('/', (req, res, next) => {
    controller.GetEvents(req, res, next)
    .then(events => {
        res.status(401).json({ events })
    })
})

export default events