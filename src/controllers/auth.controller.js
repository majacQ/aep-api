import jwt from 'jsonwebtoken'
import User from '../models/users.model'
import Workspace from '../models/workspace.model'
import config from '../config'

const DoLogin = (req, res, next) => {
  console.log('Success Login')
}

const DoRegister = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body
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

  // CHECK TO SEE IF USER EXISTS BY EMAIL
  const foundUser = await User.findOne({ email }).catch((err) => {
    throw new Error(err)
  })

  // IF USER EXISTS ERROR ALREADY IN USE
  if (foundUser)
    return res.status(409).json({ error: 'Email Address is already in use' })

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
    let workspaceIncrement = parseInt(foundWorkspace[0].name.split('_')[2] || 0)
    workspaceName += `_${++workspaceIncrement}`
  }

  // CREATE THE WORKSPACE BEFORE CREATING THE USER
  const workspace = await Workspace.create({
    name: workspaceName,
  }).catch((err) => {
    throw new Error(err)
  })

  // CREATE THE NEW USER
  const user = await User.create({
    _workspaceID: workspace._id,
    firstName,
    lastName,
    email,
    password,
  })

  // GENERATE TOKEN
  const token = signToken(user)

  return res.status(201).json({ token })
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

export default {
  DoLogin,
  DoRegister,
}
