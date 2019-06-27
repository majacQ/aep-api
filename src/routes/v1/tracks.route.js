import express from 'express'
import passport from 'passport'
import controller from '../../controllers/tracks.controller'

const tracks = express.Router()

tracks.all('/', (req, res, next) => {
  return res.status(400).json({ status: 400, error: 'Bad Request' })
})

tracks.get('/search', async (req, res, next) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    async (err, user, info) => {
      if (err) throw new Error(err)
      if (!user) return await controller.DiscogSearch(req, res, next)
      return await controller.SpotifySearch(req, res, next, user)
    },
  )(req, res, next)
})

export default tracks
