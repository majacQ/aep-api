import { spotify } from '../helpers'
export default {
  Search: async (req, res, next) => {
    const token = await spotify.GetUserAccessToken(req.user._id)
    if (token) {
      const results = await spotify.SearchForTrack(req.query, token)
      console.log(results.data.tracks.items)
      const tracks = results.data.tracks.items.map((t) => {
        return {
          id: t.id,
          title: t.name,
          explicit: t.explicit,
          preview: t.preview_url,
        }
      })
      res.status(200).json({ tracks })
    }
  },
}
