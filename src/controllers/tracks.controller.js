export default {
  Search: (req, res, next) => {
    if (req.headers['auth-spotify']) {
      return res.json({ header: true, key: req.headers['auth-spotify'] })
    }
    return res.json({ header: false, headers: req.headers })
  },
}
