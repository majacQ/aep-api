import Events from '../models/events.model'
import helpers from '../helpers'
import { Types } from 'mongoose'
import chalk from 'chalk'

export default {
  GetEvents: async (req, res, next) => {
    const { body, query } = req
    await Events.paginate(
      // HARD CODED BEFORE AUTH
      { _workspaceID: Types.ObjectId(req.user._workspaceID) },
      {
        limit: query.limit || 5,
        page: query.page || 1,
      },
    )
      .then((paged) => {
        res.status(200).json({
          hasNextPage: paged.hasNextPage,
          hasPrevPage: paged.hasPrevPage,
          limit: paged.limit,
          nextPage: paged.nextPage,
          prevPage: paged.prevPage,
          page: paged.page,
          totalPages: paged.totalPages,
          events: paged.docs,
        })
        return next()
      })
      .catch((err) => {
        // TODO: HANDLE ERRORS
        console.error(chalk.red('Error Fetching Events'), err)
      })
  },
  CreateEvent: (req, res, next) => {},
  UpdateEvent: (req, res, next) => {},
  DeleteEvent: (req, res, next) => {},
}
