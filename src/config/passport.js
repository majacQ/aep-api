import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as SpotifyStrategy } from 'passport-spotify'
import { Types } from 'mongoose'
import config from '.'
import spotify from './spotify'
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
        const user = await User.findById(payload.sub, { password: 0 })

        // If user does not exist
        if (!user)
          return done(null, false, {
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
            success: false,
            message: 'No Account Associated with Provided Email',
          })
        // Check if the password is correct
        const isValididated = await user.verify(password)
        // If not matched
        if (!isValididated)
          return done(null, false, {
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

passport.use(
  new SpotifyStrategy(
    {
      clientID: spotify.client,
      clientSecret: spotify.secret,
      callbackURL: 'http://localhost:3030/v1/auth/spotify/callback',
    },
    async (accessToken, refreshToken, expiresIn, profile, done) => {
      // console.log(profile)
      const user = await User.findOne({ _spotifyID: profile.id })
      if (user) {
        console.log(user)
        return done(null, user)
      }

      let firstName, lastName
      if (profile.displayName.split(' ').length < 2) {
        firstName = profile.emails[0].value
        lastName = profile.id
      } else {
        firstName = profile.displayName.split(' ')[0]
        lastName = profile.displayName.split(' ')[1]
      }

      const newSpotifyUser = await User.create({
        _workspaceID: Types.ObjectId('5A009c9c99aea999f9c99b99'),
        _spotifyID: profile.id,
        firstName,
        lastName,
        email: profile.emails[0].value,
        password: 'No-Login',
        dashboard: false,
        spotify: {
          accessToken,
          refreshToken,
          expiresIn,
        },
      })
      console.log(newSpotifyUser)
      return done(null, newSpotifyUser)
    },
  ),
)
