import { Types } from 'mongoose'
import chalk from 'chalk'
import { utilities } from '../helpers'
import Request from '../models/requests.model'
import Track from '../models/track.model'
import Event from '../models/events.model'

export default {
  // TODO: ERGE EVENT NAME WITH REQUESTS TO COMPRESS DATA OUTPUT
  GetRequests: async (req, res, next) => {
    const { body, query } = req
    await Request.paginate(
      { _workspaceID: Types.ObjectId(req.user._workspaceID) },
      {
        limit: query.limit || 5,
        page: query.page || 1,
      },
    )
      .then(async (paged) => {
        const trackIDs = paged.docs.map((track) => track._trackID)
        // const eventIDs = paged.docs.map((event) => event._eventID)
        const tracks = await Track.find({
          _id: {
            $in: trackIDs,
          },
        })
        // const events = await Event.find({
        //   _id: {
        //     $in: eventIDs,
        //   },
        // })
        paged.docs = paged.docs.map((r) => {
          const tracksLink = tracks.find((t) =>
            Types.ObjectId(t._id).equals(r._trackID),
          )
          // const eventLink = events.find((e) => {
          //   Types.ObjectId(e._id).equals(r._eventID)
          // })
          return {
            _id: r._id,
            _eventID: r._eventID,
            title: tracksLink.title,
            explicit: tracksLink.explicit,
            request_count: r.request_count,
            played: r.played,
          }
        })
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
  GetEventRequests: async (req, res, next) => {
    const { params, query } = req
    if (!Types.ObjectId.isValid(params.eventID))
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid Event ID',
      })

    const event = await Event.findById(params.eventID).catch((err) => {
      reject(err)
    })

    if (event._workspaceID !== Types.ObjectId(req.user._workspaceID)) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthorized',
      })
    }

    await Request.paginate(
      {
        _workspaceID: Types.ObjectId(req.user._workspaceID),
        _eventID: Types.ObjectId(params.eventID),
      },
      {
        limit: query.limit || 5,
        page: query.page || 1,
      },
    ).then(async (paged) => {
      const trackIDs = paged.docs.map((track) => track._trackID)
      const tracks = await Track.find({
        _id: {
          $in: trackIDs,
        },
      })
      paged.docs = paged.docs.map((r) => {
        const tracksLink = tracks.find((t) =>
          Types.ObjectId(t._id).equals(r._trackID),
        )
        return {
          _id: r._id,
          title: tracksLink.title,
          explicit: tracksLink.explicit,
          request_count: r.request_count,
          played: r.played,
        }
      })
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
  },
  CreateRequest: (req, res, next) => {},
  UpdateRequest: (req, res, next) => {},
  DeleteRequest: (req, res, next) => {},
  PlayRequest: (req, res, next) => {},
}
