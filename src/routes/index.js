import express from 'express'
import Auth from './v1/auth.route'
import Events from './v1/events.route'
import Requests from './v1/requests.route'
import Teapot from './v1/teapot.route'

const apiOne = express.Router()

apiOne.use('/auth', Auth)
apiOne.use('/events', Events)
apiOne.use('/requests', Requests)
apiOne.use('/teapot', Teapot)

apiOne.get('/', (req, res) => res.json({sucess: true}))

export default apiOne
