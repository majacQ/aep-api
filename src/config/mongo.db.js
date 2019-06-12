import mongoose from 'mongoose'
import config from '.'

import UserModel from '../models/users.model'
import EventModel from '../models/events.model'
// import RequestModel from '../models/requests.model'

const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.get('DB.STRING'), { useCreateIndex: true, useNewUrlParser: true }, (err) => {
            if (err) reject(err)
            resolve()
            mongoose.connection.collection('users').findOne({ email: 'braden_feeney@hotmail.com' }, (err, result) => {
                if (err) reject(err)
                console.log(result)
            })
        })
    })

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
