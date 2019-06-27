import { spotify, lasfm } from '../helpers'
export default {
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
          artists: t.album.artists.map((a) => a.name),
          art: t.album.images,
        }
      })
      res.status(200).json({ tracks })
    }
  },
  DiscogSearch: async (req, res, next) => {
    const results = await lasfm.SearchForTrack(req.query)
    // const tracks = results.data.results.trackmatches.track.map((t) => {
    //   return {
    //     id: t.id,
    //     title: t.title,
    //   }
    // })
    return res.status(200).json(results.data)
  },
}
