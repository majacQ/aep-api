import { validationResult } from 'express-validator'
import { Types } from 'mongoose'
import { isEmpty } from 'lodash'
import Event from '../models/events.model'
export default {
  hasDashboard: (req, res, next) => {
    if (req.user.dashboard) return next()
    return res.status(401).json({ status: 401, message: 'Unauthorized' })
  },
  /**
   * (Express Middleware) Map Validation Messages and Error items that got rejected from the `controller.Validate` method
   * @param  {Object} req Express Request Object
   * @param  {Object} res Express Response Object
   * @param  {Function} next Express Next Function
   */
  verifyRequest: async (req, res, next) => {
    if (isEmpty(req.body))
      return res.status(400).json({
        status: 400,
        succes: false,
        message: 'Bad Request',
      })
    const valid = await validationResult(req)
    if (!valid.isEmpty())
      return res.status(400).json({
        status: 400,
        message: valid.array().map((i) => i.msg),
        error: valid.array().map((i) => i.param),
      })
    return next()
  },
  /**
   * Verify that an event exists and is within the authenticated users workspace
   *
   * @param  {ObjectId} eventID
   * @todo FALSE POSITIVES are triggering issues
   */
  verifyWorkspace: (eventID) => {
    return new Promise(async (resolve, reject) => {
      if (!Types.ObjectId.isValid(eventID)) reject('Invalid ObjectID')
      const event = await Event.findById(eventID).catch((err) => {
        reject(err)
      })
      if (event._workspaceID !== Types.ObjectId(req.user._workspaceID)) reject()
      resolve()
    })
  },
}
