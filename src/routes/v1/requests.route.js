import express from 'express'
import passport from 'passport'
import controller from '../../controllers/requests.controller'
import { utilities } from '../../helpers'

const requests = express.Router()

// GET
requests.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => await controller.GetRequests(req, res, next),
)
requests.get(
  '/:eventID',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => await controller.GetEventRequests(req, res, next),
)

// POST
requests.post(
  '/:eventID',
  controller.Validate('create'),
  utilities.verifyRequest,
  async (req, res, next) => await controller.CreateRequest(req, res, next),
)

// PUT
requests.put(
  '/:eventID/:requestID',
  async (req, res, next) => await controller.UpdateRequest(req, res, next),
)

// DELETE
requests.delete(
  '/:eventID/:requestID',
  async (req, res, next) => await controller.DeleteRequest(req, res, next),
)

export default requests
