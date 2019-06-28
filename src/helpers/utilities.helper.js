import { validationResult } from 'express-validator'
export default {
  hasDashboard: (req, res, next) => {
    if (req.user.dashboard) return next()
    return res.status(401).json({ status: 401, message: 'Unauthorized' })
  },
  verifyRequest: async (req, res, next) => {
    const valid = await validationResult(req)
    if (!valid.isEmpty())
      return res.status(400).json({
        status: 400,
        message: valid.array().map((i) => i.msg),
        error: valid.array().map((i) => i.param),
      })
    return next()
  },
}
