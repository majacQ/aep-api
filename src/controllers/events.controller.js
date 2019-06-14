import Events from '../models/events.model'
import helpers from '../helpers'
import { Types } from 'mongoose'

const GetEvents = (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    const { body, query } = req
    console.log(body)
    console.log(query)
    Events.paginate(
      { _workspaceID: Types.ObjectId('5cffd724323f5b57f895d5ff') },
      {
        limit: query.limit || 5,
        page: query.page || 1,
      },
    )
      .then((events) => {
        resolve(events)
      })
      .catch((err) => {
        // TODO: HANDLE ERRORS
        reject(new Error(err))
      })
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
