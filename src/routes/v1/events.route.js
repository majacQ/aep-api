import express from 'express'
import passport from 'passport'
import controller from '../../controllers/events.controller'
const events = express.Router()

events.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    return await controller.GetEvents(req, res, next)
  },
)
events.get('/:eventID', async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err)
      return res
        .status(500)
        .json({ status: 500, message: 'Internal Server Error' })

    if (!user) return await controller.GetEvent(req, res, next)
    return await controller.GetEvent(req, res, next, user)
  })(req, res, next)
})

events.post(
  '/create',
  [
    passport.authenticate('jwt', { session: false }),
    controller.Validate('create'),
  ],
  async (req, res, next) => {
    controller.CreateEvent(req, res, next)
  },
)
export default events
