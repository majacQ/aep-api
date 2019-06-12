import express from 'express'
import controller from '../../controllers/events.controller'
const events = express.Router()

events.get('/', (req, res, next) => {
  controller
    .GetEvents(req, res, next)
    .then((paged) => {
      res.status(200).json({
        hasNextPage: paged.hasNextPage,
        hasPrevPage: paged.hasPrevPage,
        limit: paged.limit,
        nextPage: null,
        page: 1,
        prevPage: null,
        totalPages: 1,
        events: paged.docs,
      })
    })
    .catch((err) => {
      // TODO: HANDLE ERRORS
      throw new Error(err)
    })
})

export default events
