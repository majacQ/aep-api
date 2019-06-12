import mongoose from 'mongoose'
import config from '.'
// import RequestModel from '../models/requests.model'

const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      config.get('DB.STRING'),
      { useCreateIndex: true, useNewUrlParser: true },
      async (err) => {
        if (err) reject(err)
        resolve()
        // TESTING INSTANCE METHODS
        // await mongoose.connection
        //   .collection('users')
        //   // HARD CODED TEST EMAIL
        //   .findOne({ email: 'braden_feeney@hotmail.com' }, (err, result) => {
        //     if (err) reject(err)
        //     console.log(result)
        //     console.log(result.verify('test1234'))
        //   })
      },
    )
  })
}

const close = () => {
  return mongoose.disconnect()
}

export default { connect, close }
