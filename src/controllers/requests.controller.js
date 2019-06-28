import { Types } from 'mongoose'
import Requests from '../models/requests.model'

export default {
  GetRequests: async (req, res, next) => {
    const { body, query } = req
    await Requests.paginate(
      { _workspaceID: Types.ObjectId(req.user._id) },
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
          requests: paged.docs,
        })
      })
      .catch((err) => {
        // TODO: HANDLE ERRORS
        console.error(chalk.red('Error Fetching Events'), err)
      })
  },
  GetEventRequests: (req, res, next) => {},
  CreateRequest: (req, res, next) => {},
  UpdateRequest: (req, res, next) => {},
  DeleteRequest: (req, res, next) => {},
  PlayRequest: (req, res, next) => {},
}
