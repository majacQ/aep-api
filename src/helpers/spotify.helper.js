import Axios from 'axios'
import QueryString from 'querystring'
import User from '../models/users.model'
import chalk from 'chalk'
import { existsSync } from 'fs'

let spotify
if (existsSync('../config/spotify')) {
  spotify = require('../config/spotify')
}
export default {
  GetAcessTokens: (code) => {
    return Axios.post(
      'https://accounts.spotify.com/api/token',
      QueryString.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:3030',
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${spotify.client || process.env.SPOTIFY_CLIENT}:${spotify.secret ||
              process.env.SPOTIFY_SECRET}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      .then((response) => {
        const expires_at = new Date()
        expires_at.setSeconds(
          expires_at.getSeconds() + response.data.expires_in,
        )
        response.data.expires_at = expires_at
        return response.data
      })
      .catch((err) => {
        const error = new Error(err.response.data.error_description)
        error.status = err.response.status
        throw error
      })
  },
  GetUserProfile: (access_token) => {
    return Axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.data)
      .catch((err) => {
        const error = new Error(err.response.data.error_description)
        error.status = err.response.status
        throw error
      })
  },
  GenerateSpotifyName: (displayName, id) => {
    if (displayName.split(' ').length < 2) {
      return {
        first: displayName,
        last: id,
      }
    }
    return {
      first: displayName.split(' ')[0],
      last: displayName.split(' ')[1],
    }
  },
  GetUserAccessToken: async (UserID) => {
    const user = await User.findById(UserID, { spotify: 1 })

    if (!user) return new Error('User Not Found')
    if (!ValidateAccessToken(user.spotify.expires_at)) {
      user.spotify.access_token = await UpdateAccessToken(
        user.spotify.refresh_token,
        UserID,
      )
    }

    return user.spotify.access_token || null
  },
  SearchForTrack: (Query, access_token) => {
    return Axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: Query,
    })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err.response.data)
        const error = new Error(err.response.data.error_description)
        error.status = err.response.status
        throw error
      })
  },
}

const ValidateAccessToken = (expires_at) => {
  // console.log(chalk.cyan('ValidateAccessToken'))
  const expires = new Date(expires_at)
  const now = new Date()
  // console.log(chalk.cyan(expires))
  // console.log(chalk.cyan(now))
  if (expires < now) {
    return false
  }
  return true
}

const UpdateAccessToken = (refresh_token, UserID) => {
  console.log(chalk.magenta('UpdateAccessToken'))
  return Axios.post(
    'https://accounts.spotify.com/api/token',
    QueryString.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${spotify.client || process.env.SPOTIFY_CLIENT}:${spotify.secret ||
            process.env.SPOTIFY_SECRET}`,
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
    .then(async (response) => {
      const expires_at = new Date()
      expires_at.setSeconds(
        expires_at.getSeconds() + (response.data.expires_in - 300),
      )
      await User.updateOne(
        { _id: UserID },
        {
          $set: {
            'spotify.access_token': response.data.access_token,
            'spotify.expires_at': expires_at,
          },
        },
      ).catch((err) => {
        console.log(chalk.cyan('Error Has Occured'), err)
      })
      // console.log(chalk.magenta('SuccessUpdate'))
      return response.data.access_token
    })
    .catch((err) => {
      console.error(err)
    })
}
