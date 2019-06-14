import '@babel/polyfill'
import express from 'express'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import passport from 'passport'
import config from './config'
import mongo from './config/mongo.db'
import api from './routes'

require('./config/passport')

const server = express()

if (config.get('env') === 'development') {
  server.use(morgan('dev'))
}
server.use(compression())
server.use(helmet())
server.use(json())
server.use(urlencoded({ extended: false }))
server.use(cookieParser())
server.use(passport.initialize())

server.use('/v1', api)

server.get('/', (req, res) => res.json({ sucess: true }))

mongo.connect().then(() => {
  console.log('Mongo Connected')
  server.listen(config.get('API_PORT'), config.get('API_HOST'), () => {
    console.log('Server Started')
  })
})

module.exports = server
