import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Types } from 'mongoose'

import User from '../models/events.model'

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
        User.findOne({ email: 'braden_feeney@hotmail.com' }, (err, result) => {
            if (err) reject(err)
            console.log(result)
        })
        return done('Incorrect Email / Password')
}))
