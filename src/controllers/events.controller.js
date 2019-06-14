import Events from '../models/events.model'
import helpers from '../helpers'
import { Types } from 'mongoose'

const GetEvents = async (req, res, next) => {
  const { body, query } = req
  console.log('GetEvents()')
  await Events.paginate(
    // HARD CODED BEFORE AUTH
    { _workspaceID: Types.ObjectId('5d003c0c34aea526f8c44b65') },
    {
      limit: query.limit || 5,
      page: query.page || 1,
    },
  )
    .then((paged) => {
      console.log('Paged Events')
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
      return next()
    })
    .catch((err) => {
      // TODO: HANDLE ERRORS
      throw new Error(err)
    })
}

const CreateEvent = (req, res, next) => {}

const UpdateEvent = (req, res, next) => {}

const DeleteEvent = (req, res, next) => {}

export default {
  GetEvents,
  CreateEvent,
  UpdateEvent,
  DeleteEvent,
}
