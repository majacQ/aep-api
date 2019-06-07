import express from 'express'
import config from './config'

const server = express()

server.listen(config.get('API_PORT'), config.get('API_HOST'), () => {
    console.log('LAUNCHED AEP API')
})
