import express from 'express'
import passport from 'passport'
import controller from '../../controllers/events.controller'
import { utilities } from '../../helpers'
const events = express.Router()

// GET
events.get('/', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (!user.dashboard)
      return res.status(401).json({ status: 401, message: 'Unauthorized' })
    return await controller.GetEvents(req, res, next, user)
  })(req, res, next)
})
events.get('/:eventID', async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err)
      return res
        .status(500)
        .json({ status: 500, message: 'Internal Server Error' })

    if (!user || !user.dashboard)
      return await controller.GetEvent(req, res, next)
    return await controller.GetEvent(req, res, next, user)
  })(req, res, next)
})

// POST
events.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  utilities.hasDashboard,
  controller.Validate('create'),
  utilities.verifyRequest,
  async (req, res, next) => {
    return await controller.CreateEvent(req, res, next)
  },
)

// PUT
events.put(
  '/:eventID',
  passport.authenticate('jwt', { session: false }),
  utilities.hasDashboard,
  controller.Validate('update'),
  utilities.verifyRequest,
  async (req, res, next) => {
    return controller.UpdateEvent(req, res, next)
  },
)
// DELETE
events.delete(
  '/:eventID',
  passport.authenticate('jwt', { session: false }),
  utilities.hasDashboard,
  async (req, res, next) => {
    return controller.DeleteEvent(req, res, next)
  },
)
export default events
