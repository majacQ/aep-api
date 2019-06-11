import mongoose from 'mongoose'
import config from '.'

import UserModel from '../models/users.model'
import EventModel from '../models/events.model'
// import RequestModel from '../models/requests.model'

const connect = () => {
    return mongoose.connect(config.get('DB.STRING'), { useCreateIndex: true, useNewUrlParser: true })
}

const close = () => {
    return mongoose.disconnect()
}

export { connect, close }

export default {
    UserModel,
    EventModel,
    // RequestModel,
}
