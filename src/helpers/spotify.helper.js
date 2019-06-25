import Axios from 'axios'
import QueryString from 'querystring'
import spotify from '../config/spotify'
import User from '../models/users.model'

export default {
  GetAcessTokens: (code) => {
    return Axios.post(
      'https://accounts.spotify.com/api/token',
      QueryString.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:8080',
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${spotify.client}:${spotify.secret}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      .then((response) => response.data)
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
    return user.spotify.access_token || null
  },
  UpdateAccessToken: (UserID) => {},
  SearchForTrack: (Query, access_token) => {
    return Axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: Query,
    })
  },
}
