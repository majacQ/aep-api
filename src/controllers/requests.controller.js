/**
 * Request Controller
 * @author AMDJ Entertainment
 * @version 0.0.2
 */

import { Types } from 'mongoose'
import chalk from 'chalk'
import { body } from 'express-validator'
import Request from '../models/requests.model'
import Track from '../models/track.model'
import Event from '../models/events.model'

export default {
  /**
   * Get all requests for a given workspace
   *
   * @param  {ExpressReuqest} req Express Request Object
   * @param  {ExpressResponse} res Express Response Object
   * @param  {ExpressNext} next Express Next Function
   * @returns {Object} All requests from a workspace (paginated)
   * @todo MERGE EVENT NAME WITH REQUESTS TO COMPRESS DATA OUTPUT
   */
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
  /**
   * Get all requests for a given event
   *
   * @param  {ExpressReuqest} req Express Request Object
   * @param  {ExpressResponse} res Express Response Object
   * @param  {ExpressNext} next Express Next Function
   * @returns {Object} All requests from an event (paginated)
   */
  GetEventRequests: async (req, res, next) => {
    try {
      const { params, query } = req
      if (!Types.ObjectId.isValid(params.eventID))
        return res.status(400).json({
          status: 400,
          success: false,
          message: 'Invalid Event ID',
        })

      const event = await Event.findById(params.eventID)

      if (!event)
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Event Not Found',
        })

      if (!Types.ObjectId(event._workspaceID).equals(req.user._workspaceID)) {
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
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  },
  /**
   * Create a new song request request for a specific event in a users workspace
   *
   * @param  {ExpressReuqest} req Express Request Object
   * @param  {ExpressResponse} res Express Response Object
   * @param  {ExpressNext} next Express Next Function
   * @returns  {Object} Express Response
   */
  CreateRequest: async (req, res, next) => {
    const { body } = req

    const event = await Event.findById(body._eventID)
    if (!event)
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Event Not Found',
      })
    if (!Types.ObjectId(body._workspaceID).equals(event._workspaceID))
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Event Workspace Mismatch',
      })
    const track = await Track.findById(body._trackID)
    if (!track)
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Track Not Found',
      })
    let request = await Request.findOne({
      _trackID: Types.ObjectId(body._trackID),
      _eventID: Types.ObjectId(body._eventID),
    })
    if (request) {
      request.request_count++
      request.save()
      return res.status(200).json({
        status: 200,
        success: true,
      })
    }
    request = new Request(body)
    await request.save()
    return res.json({
      status: 200,
      success: true,
    })
  },
  /**
   * Update a request for a specific event
   *
   * @param  {ExpressReuqest} req Express Request Object
   * @param  {ExpressResponse} res Express Response Object
   * @param  {ExpressNext} next Express Next Function
   * @returns  {Object} Express Response
   */
  UpdateRequest: (req, res, next) => {},
  /**
   * Delete a request for a specific event
   *
   * @param  {ExpressReuqest} req Express Request Object
   * @param  {ExpressResponse} res Express Response Object
   * @param  {ExpressNext} next Express Next Function
   * @returns  {Object} Express Response
   */
  DeleteRequest: (req, res, next) => {},
  /**
   * Marked a request as played for a specific event
   *
   * @param  {ExpressReuqest} req Express Request Object
   * @param  {ExpressResponse} res Express Response Object
   * @param  {ExpressNext} next Express Next Function
   * @returns  {Object} Express Response
   */
  PlayRequest: (req, res, next) => {},
  /**
   * NOT IMPLEMENTED
   * @todo vNext 1.2.0
   */
  IgnoreRequest: (req, res, next) => {},
  /**
   * NOT IMPLEMENTED
   * @todo vNext 1.2.0
   */
  QueueRequest: (req, res, next) => {},
  /**
   * (Express Middleware) Validate the body of the request for event requests
   *
   *
   * @param  {String} method
   */
  Validate: (method) => {
    switch (method) {
      case 'create':
        return [
          body('_id')
            .not()
            .exists()
            .withMessage('Cannot set Request ID'),
          body('played')
            .not()
            .exists()
            .withMessage('Cannot set Played'),
          body('request_count')
            .not()
            .exists()
            .withMessage('Cannot set Request Count'),
          body('_workspaceID').custom((_workspaceID) => {
            if (typeof _workspaceID === 'undefined')
              return Promise.reject('Missing Workspace ID')
            if (!Types.ObjectId.isValid(_workspaceID))
              return Promise.reject('Workspace ID Invalid')
            return Promise.resolve()
          }),
          body('_eventID').custom((_eventID) => {
            if (typeof _eventID === 'undefined')
              return Promise.reject('Missing Event ID')
            if (!Types.ObjectId.isValid(_eventID))
              return Promise.reject('Event ID Invalid')
            return Promise.resolve()
          }),
          body('_trackID').custom((_trackID) => {
            if (typeof _trackID === 'undefined')
              return Promise.reject('Missing Track ID')
            if (!Types.ObjectId.isValid(_trackID))
              return Promise.reject('Track ID Invalid')
            return Promise.resolve()
          }),
        ]
      default:
        return false
    }
  },
}
