import { spotify, deezer, utilities } from '../helpers'
import Track from '../models/track.model'
import Artist from '../models/artist.model'

export default {
  LocalSearch: async (req) => {
    const { q, artist } = req.query

    const search = await Track.find(
      { title: new RegExp(q) },
      { _spotifyID: 0, createdAt: 0, updatedAt: 0 },
    ).catch((error) => {
      error
    })
    const tracks = search.map((t) => {
      return {
        id: t._id,
        title: t.title,
        explicit: t.explicit,
        preview: t.spotifyPreview || t.deezerPreview,
        artists: t._artistIDs,
        art: t.art.spotify.concat(t.art.deezer),
      }
    })
    const artists = await Artist.find({
      _id: {
        $in: utilities.flatten(
          tracks.map((t) => {
            return t.artists
          }),
        ),
      },
    })
    console.log(artists)
    if (tracks.length === 0) return null
    return { tracks }
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
              id: a.id,
              name: a.name,
            }
          }),
          art: t.album.images,
        }
      })
      if (tracks.length === 0)
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'No Tracks Found',
          query: req.query,
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
