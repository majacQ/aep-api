import express from 'express'
import passport from 'passport'
import controller from '../../controllers/auth.controller'

const auth = express.Router()

auth.all('/', (req, res) =>
  res.status(400).json({ status: 400, error: 'Bad Request' }),
)

// POST
auth.post('/login', (req, res, next) =>
  // START LOGIN PROCESS
  controller.DoLogin(req, res, next),
)

auth.post('/register', (req, res, next) =>
  // START REGISTERING PROCESS
  controller.DoRegister(req, res, next),
)

auth.get(
  '/spotify',
  passport.authenticate('spotify', { scope: ['user-read-email'] }),
  (req, res, next) => {
    // WILL NOT BE CALLED, REDIRECTION TO SPOTIFY
  },
)

auth.get(
  '/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res, next) => {
    res.json({ success: true })
  },
)

export default auth
