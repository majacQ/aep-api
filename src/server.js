import "@babel/polyfill"
import express from 'express'
import compression from 'compression'
import erl from 'express-rate-limit'
import helmet from 'helmet'
import { json } from 'body-parser'
// import config from './config'
import { connect } from './config/mongo.db'
import api from './routes'
import './config/local.strategy'

const server = express()

server.use(compression())
server.use(helmet())
server.use(json())

server.use('/v1', api)

server.get('/', (req, res) => res.json({sucess: true}))

// TODO: REPLACE WITH CONFIG BEFORE PUSHING TO REPO
server.listen(3000, '0.0.0.0', () => {
    console.log('Server Started')
    connect().then(() => {
        console.log('Mongo Connected')
    })
})
// server.listen(config.get('API_PORT'), config.get('API_HOST'), () => {
//     // console.log('LAUNCHED AEP API')
// })

module.exports = server