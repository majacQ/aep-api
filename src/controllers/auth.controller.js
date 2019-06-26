import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import User from '../models/users.model'
import Workspace from '../models/workspace.model'
import config from '../config'
import { spotify } from '../helpers'

export default {
  DoLogin: (req, res, next, user) => {
    if (!req.body.email || !req.body.password)
      return res.status(400).json({ status: 400, message: 'Bad Request' })
    passport.authenticate('local', function(err, user, info) {
      // SERVER ERROR
      if (err) return next(err)
      // IF AUTH FAILED RETURN MESSAGE
      if (info) return res.status(info.status || 401).json(info)
      // IF AUTH PASSED CREATE JWT TOKEN
      const token = signToken(user)
      return res.status(200).json({ success: true, token })
    })(req, res, next)
  },
  DoRegister: async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body
    if (!Object.keys(req.body).length)
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      })

    if (!email)
      return res.status(400).json({
        status: 400,
        message: 'Email Address is required',
      })

    if (!password)
      return res.status(400).json({
        status: 400,
        message: 'A Password is required',
      })

    if (!firstName || !lastName)
      return res.status(400).json({
        status: 400,
        message:
          'First and Last Name are required to create a more personalized experience.',
      })

    // CHECK TO SEE IF USER EXISTS BY EMAIL
    const foundUser = await User.findOne({ email }).catch((err) => {
      throw new Error(err)
    })

    // IF USER EXISTS ERROR ALREADY IN USE
    if (foundUser)
      return res
        .status(409)
        .json({ status: 409, message: 'Email Address is already in use' })

    // CREATE WORKSPACE BASE NAME TO LOWERCASE
    let workspaceName = `${firstName}_${lastName}`.toLocaleLowerCase()
    // CHECK TO SEE IF NAMES WHERE USED IN ANOTHER WORKSPACE
    const foundWorkspace = await Workspace.find({
      name: new RegExp(workspaceName, 'i'),
    })
      .sort({ name: -1 })
      .limit(1)
      .catch((err) => {
        throw new Error(err)
      })

    // IF WORKSAPCE NAME EXISTS
    if (foundWorkspace.length > 0) {
      // CREATE NEW WORKSPACE NAME WITH APPENDED NUMBER ACCORDING TO WORKSPACES
      let workspaceIncrement = parseInt(
        foundWorkspace[0].name.split('_')[2] || 0,
      )
      workspaceName += `_${++workspaceIncrement}`
    }

    // CREATE THE WORKSPACE BEFORE CREATING THE USER
    const workspace = await Workspace.create({
      name: workspaceName,
    }).catch((err) => {
      throw new Error(err)
    })

    // CREATE THE NEW USER
    // FIX: CHANGE TO NEW INSTANCE OF USER NOT CREATE()
    const user = await User.create({
      _workspaceID: workspace._id,
      firstName,
      lastName,
      email,
      password,
    })

    // GENERATE TOKEN
    const token = signToken(user)

    return res.status(201).json({ success: true, token })
  },
  SpotifyLogin: async (req, res, next) => {
    const { code } = req.body
    const spotifyAccess = await spotify.GetAcessTokens(code)
    if (!spotifyAccess)
      return res.status(400).json({ status: 400, message: 'Bad Request' })

    const { access_token, refresh_token, expires_in, scope } = spotifyAccess

    const spotifyUser = await spotify.GetUserProfile(access_token)
    if (!spotifyUser)
      return res.status(400).json({ status: 400, message: 'Bad Request' })

    const user = await User.findOne({ _spotifyID: spotifyUser.id })

    let token
    if (!user) {
      let name = spotify.GenerateSpotifyName(
        spotifyUser.display_name,
        spotifyUser.id,
      )

      const newUser = await User.create({
        _workspaceID: Types.ObjectId('5a009c9c99aea999f9c99b99'),
        _spotifyID: spotifyUser.id,
        firstName: name.first,
        lastName: name.last,
        email: spotifyUser.email,
        dashboard: false,
        spotify: {
          access_token,
          refresh_token,
          expires_in,
          scope,
        },
      })

      token = signToken(newUser)
      return res.status(200).json({ success: true, token })
    }

    token = signToken(user)
    return res.status(200).json({ success: true, token })
  },
}

const signToken = (user) => {
  return jwt.sign(
    {
      wid: user._workspaceID,
      iat: new Date().getTime(),
    },
    config.get('SECURITY.SECRET'),
    {
      issuer: config.get('SECURITY.JWT.ISSUER'),
      subject: user.id,
      expiresIn: config.get('SECURITY.JWT.EXPIRES_IN'),
    },
  )
}
