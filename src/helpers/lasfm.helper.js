import Axios from 'axios'
import lastfm from '../config/lastfm'
export default {
  SearchForTrack: (Query) => {
    return Axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'track.getInfo',
        track: Query.track,
        artist: Query.artist,
        limit: Query.limit,
        api_key: lastfm.key,
        format: 'json',
      },
    }).catch((err) => {
      console.log(err)
    })
  },
}
