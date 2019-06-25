import Events from '../models/events.model'
import { Types } from 'mongoose'
import chalk from 'chalk'
import { body, validationResult } from 'express-validator'
import { validationHandler, mongooseHelpers } from '../helpers'

export default {
  GetEvents: async (req, res, next, user) => {
    const { body, query } = req
    await Events.paginate(
      // HARD CODED BEFORE AUTH
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
    const valid = await validationResult(req)
    console.log(valid)
    if (!valid.isEmpty())
      return res.status(400).json({
        status: 400,
        message: valid.array().map((i) => i.msg),
        error: valid.array().map((i) => i.param),
      })

    await Events.create(req.body)
      .then(() => {
        return res.status(201).json({ status: 201, success: true })
      })
      .catch((err) => {
        const response = mongooseHelpers.errorResponse(err)
        return res.status(response.status).json(response)
      })
  },
  UpdateEvent: (req, res, next) => {},
  DeleteEvent: (req, res, next) => {},
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
      default:
        break
    }
  },
}
