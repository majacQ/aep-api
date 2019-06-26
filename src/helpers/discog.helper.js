// API ENDPOINT https://api.discogs.com/
import Axios from 'axios'
import discogs from '../config/discogs'
export default {
  SearchForTrack: (Query) => {
    return Axios.get('https://api.discogs.com/database/search', {
      params: {
        track: Query.q,
        title: Query.title,
      },
      headers: {
        Authorization: `Discogs key=${discogs.key}, secret=${discogs.secret}`,
      },
    })
  },
}
