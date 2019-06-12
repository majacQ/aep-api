import express from 'express'
import controller from '../../controllers/auth.controller'
import passport from 'passport'

const auth = express.Router()

auth.all('/', (req, res) => res.status(400).json({ error: 'Bad Request' }))

// POST
auth.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res, next) => controller.DoLogin(req, res, next),
)
auth.post('/register', (req, res, next) =>
  controller.DoRegister(req, res, next),
)

export default auth
