import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import User from '../models/events.model'

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    try {
        User.findOne({ email }, function (err, user) {
            const buildUser = {
                email
            }
            console.log(user.verify('test1234'))
            if(user.verify(password)) return done(null, buildUser)
        })
        return done('Incorrect Email / Password')
    } catch (error) {
        done(error)
    }
}))
