import chalk from 'chalk'
import { Types } from 'mongoose'
import { omitBy, isUndefined, isNull, isEmpty } from 'lodash'
import { body, check } from 'express-validator'
import Events from '../models/events.model'
import { mongooseHelpers } from '../helpers'

export default {
  GetEvents: async (req, res, next, user) => {
    const { body, query } = req
    await Events.paginate(
      { _workspaceID: Types.ObjectId(user._workspaceID) },
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
  GetEvent: async (req, res, next, user = null) => {
    const { eventID } = req.params
    let event = null

    if (Types.ObjectId.isValid(eventID))
      event = await Events.findById(Types.ObjectId(eventID))
    else event = await Events.findOne({ code: eventID })

    if (!event)
      return res.status(404).json({ status: 404, message: 'Event Not Found' })

    if (!user) {
      return res.status(200).json({
        code: event.code,
        name: event.name,
        details: event.details,
        open: event.open,
        close: event.close,
      })
    }
    return res.status(200).json({
      _workspace: event._workspaceID,
      code: event.code,
      name: event.name,
      details: event.details,
      open: event.open,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    })
  },
  CreateEvent: async (req, res, next) => {
    await Events.create(req.body)
      .then(() => {
        return res.status(201).json({ status: 201, success: true })
      })
      .catch((err) => {
        const response = mongooseHelpers.errorResponse(err)
        return res.status(response.status).json(response)
      })
  },
  UpdateEvent: async (req, res, next) => {
    const { eventID } = req.params
    const event = await Events.findOne({
      $or: [
        { code: eventID.toUpperCase() },
        {
          _id: Types.ObjectId.isValid(eventID)
            ? Types.ObjectId(eventID)
            : undefined,
        },
      ],
    }).catch((err) => {
      throw new Error(err)
    })

    if (!event)
      return res
        .status(404)
        .json({ status: 404, success: false, message: 'Event Not Found' })
    if (!Types.ObjectId(req.user._workspaceID).equals(event._workspaceID))
      return res
        .status(401)
        .json({ status: 401, success: true, message: 'Unauthorized' })

    const { code, name, details, open, close, archived_at } = req.body

    await Events.updateOne(
      { _id: event._id },
      omitBy(
        {
          code,
          name,
          details,
          open,
          close,
          archived_at,
        },
        (v) => {
          if (isUndefined(v) || isNull(v) || isEmpty(v)) return true
          return false
        },
      ),
    )
      .then((results) => {
        if (results.nModified < 1) throw new Error('Error Updating Event')
        console.log(results)
      })
      .catch((err) => {
        // FIX: HANDLE DUPLICATION ERROR
        throw new Error(err)
      })
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Event Updated',
    })
  },
  DeleteEvent: async (req, res, next) => {
    const { eventID } = req.params
    const event = await Events.findOne({
      $or: [
        { code: eventID.toUpperCase() },
        {
          _id: Types.ObjectId.isValid(eventID)
            ? Types.ObjectId(eventID)
            : undefined,
        },
      ],
    }).catch((err) => {
      throw new Error(err)
    })

    if (!event)
      return res
        .status(404)
        .json({ status: 404, success: true, message: 'Event Not Found' })
    if (!Types.ObjectId(req.user._workspaceID).equals(event._workspaceID))
      return res
        .status(401)
        .json({ status: 401, success: true, message: 'Unauthorized' })

    await Events.deleteOne({
      _id: event._id,
      code: event.code.toUpperCase(),
    })
      .then((results) => {
        if (results.deletedCount < 1) throw new Error('Cannot Find Event')
      })
      .catch((err) => {
        throw new Error(err)
      })

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Event Deleted',
    })
  },
  Validate: (method) => {
    switch (method) {
      case 'create':
        return [
          body('code').custom((code) => {
            if (!code) return Promise.reject('An event node is required')
            if (code.length < 4 || code.length > 10)
              return Promise.reject(
                'An event code must be greater than 3 and less than 11 characters',
              )
            return Promise.resolve()
          }),
          body('name').custom((name) => {
            if (!name) return Promise.reject('An event name is required')
            if (name.length < 8 || name.length > 120)
              return Promise.reject(
                'An event name must be greater than 7 and less than 121 characters',
              )
            return Promise.resolve()
          }),
          body('details')
            .optional()
            .trim()
            .escape(),
          body('open', 'An event request open date is required').exists(),
          body('open').custom((value, { req }) => {
            if (value > req.body.close)
              return Promise.reject(
                'An event open date cannot be greater than its close date',
              )
            return Promise.resolve()
          }),
          body('close', 'An event request close Date is required').exists(),
          body('close').custom((value, { req }) => {
            if (value < req.body.open)
              return Promise.reject(
                'An event close date cannot be less than its open date',
              )
            return Promise.resolve()
          }),
        ]
      case 'update':
        return [
          body('code').custom((code) => {
            if (code) {
              if (code.length < 4 || code.length > 10)
                return Promise.reject(
                  'An event code must be greater than 3 and less than 11 characters',
                )
            }
            return Promise.resolve()
          }),
          body('name').custom((name) => {
            if (name) {
              if (name.length < 8 || name.length > 120)
                return Promise.reject(
                  'An event name must be greater than 7 and less than 121 characters',
                )
            }
            return Promise.resolve()
          }),
          body('details')
            .optional()
            .trim()
            .escape(),
          body('open').custom((value, { req }) => {
            if (value) {
              if (value > req.body.close)
                return Promise.reject(
                  'An event open date cannot be greater than its close date',
                )
            }
            return Promise.resolve()
          }),
          body('close').custom((value, { req }) => {
            if (value) {
              if (value < req.body.open)
                return Promise.reject(
                  'An event close date cannot be less than its open date',
                )
            }
            return Promise.resolve()
          }),
        ]
      default:
        break
    }
  },
}
