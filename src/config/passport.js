import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import config from '.'
import User from '../models/users.model'

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: config.get('SECURITY.SECRET'),
    },
    async (payload, done) => {
      try {
        // Find the user secified in token
        const user = await User.findById(payload.sub, {
          password: 0,
          spotify: 0,
          _spotifyID: 0,
        })

        // If user does not exist
        if (!user)
          return done(null, false, {
            status: 404,
            success: false,
            message: 'No Account Associated with Provided Email',
          })

        // Otherwise, Return the user
        done(null, user)
      } catch (error) {
        done(error, false, {
          status: 500,
          error: 'An Interal Server Error has Occurred',
        })
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
        // If not found
        if (!user)
          return done(null, false, {
            status: 401,
            success: false,
            message: 'No Account Associated with Provided Email',
          })

        if (!user.dashboard)
          return done(null, false, {
            status: 401,
            success: false,
            message: 'Sign-In Method Denied',
          })
        // Check if the password is correct
        const isValididated = await user.verify(password)
        // If not matched
        if (!isValididated)
          return done(null, false, {
            status: 401,
            success: false,
            message: 'Incorect Email/Password',
          })

        // Return the user
        done(null, user)
      } catch (error) {
        done(error, false, {
          status: 500,
          error: 'An Interal Server Error has Occurred',
        })
      }
    },
  ),
)
