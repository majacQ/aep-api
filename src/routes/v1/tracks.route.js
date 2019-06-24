import express from 'express'
import passport from 'passport'
import controller from '../../controllers/tracks.controller'

const tracks = express.Router()

tracks.all('/', (req, res, next) => {
  return res.status(400).json({ status: 400, error: 'Bad Request' })
})

tracks.get('/search', (req, res, next) => {
  return controller.Search(req, res, next)
})

export default tracks
