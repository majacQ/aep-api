import passport from 'passport'
import { Strategy as JWTStrategy } from 'passport-jwt'
import config from '.'

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwttkn,
    secretOrKey: config.auth.secret,
}, (payload, done) => {
    if (Date.now() > payload.expires) return done('Expired')
    return done(null, payload)
}
))