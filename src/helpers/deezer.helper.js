import Axios from 'axios'
export default {
  SearchForTrack: (Query) => {
    return Axios.get('https://api.deezer.com/search', {
      params: Query,
    })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err)
      })
  },
}
