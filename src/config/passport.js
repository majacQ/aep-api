import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import config from '.'
import User from '../models/users.model'

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
      secretOrKey: config.get('SECURITY.SECRET'),
    },
    async (payload, done) => {
      try {
        // Find the user secified in token
        const user = await User.findById(payload.sub)

        // If user does not exist
        if (!user) return done(null, false)

        // Otherwise, Return the user
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    },
  ),
)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await User.findOne({ email })
        console.log(user)
        // If not found
        if (!user) return done(null, false)
        // Check if the password is correct
        const isValididated = await user.verify(password)
        // If not matched
        if (!isValididated) return done(null, false)

        // Return the user
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    },
  ),
)
