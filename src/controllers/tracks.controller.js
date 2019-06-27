import { spotify, deezer } from '../helpers'
import Track from '../models/track.model'

export default {
  LocalSearch: async (req) => {
    const { q, artist } = req.params

    const search = await Track.find(
      { title: q },
      { _artistIDs: 0, _spotifyID: 0, createdAt: 0, updatedAt: 0 },
    ).catch((error) => {
      error
    })
    console.log(search)
    return null
  },
  SpotifySearch: async (req, res, next, user) => {
    const token = await spotify.GetUserAccessToken(user._id)
    if (token) {
      const results = await spotify.SearchForTrack(req.query, token)
      const tracks = results.tracks.items.map((t) => {
        return {
          id: t.id,
          title: t.name,
          explicit: t.explicit,
          preview: t.preview_url,
          artists: t.album.artists.map((a) => {
            return {
              _spotifyID: a.id,
              name: a.name,
            }
          }),
          art: t.album.images,
        }
      })
      res.status(200).json({ tracks })
    }
  },
  DeezerSearch: async (req, res, next) => {
    const results = await deezer.SearchForTrack(req.query)
    const tracks = results.data.map((t) => {
      return {
        id: t.id,
        title: t.title,
        explicit: t.explicit_lyrics ? true : false,
        preview: t.preview,
        artists: [
          {
            id: t.artist.id,
            name: t.artist.name,
            picture: t.artist.picture_xl,
          },
        ],
        art: [
          { height: 56, url: t.album.cover_small, width: 56 },
          {
            height: 250,
            url: t.album.cover_medium,
            width: 250,
          },
          {
            height: 500,
            url: t.album.cover_big,
            width: 500,
          },
        ],
      }
    })
    return res.status(200).json({ tracks })
  },
}
