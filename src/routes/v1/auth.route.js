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

auth.post('/spotify', async (req, res, next) => {
  return await controller.SpotifyLogin(req, res, next)
})

export default auth
