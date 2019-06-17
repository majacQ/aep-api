import express from 'express'
import passport from 'passport'
import Auth from './v1/auth.route'
import Events from './v1/events.route'
import Requests from './v1/requests.route'
import Teapot from './v1/teapot.route'
import Dev from './dev/dev.route'
import config from '../config'

const apiOne = express.Router()

apiOne.use('/auth', Auth)
apiOne.use('/events', passport.authenticate('jwt', { session: false }), Events)
apiOne.use('/requests', Requests)
apiOne.use('/teapot', Teapot)

if (config.get('env') != 'production') {
  apiOne.use('/dev', Dev)
}

apiOne.get('/', (req, res) => res.json({ sucess: true }))

export default apiOne
