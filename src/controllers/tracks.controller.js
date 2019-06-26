import { spotify } from '../helpers'
export default {
  Search: async (req, res, next) => {
    const token = await spotify.GetUserAccessToken(req.user._id)
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
}
