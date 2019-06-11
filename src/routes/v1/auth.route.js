import express from 'express'
import controller from '../../controllers/auth.controller'

const auth = express.Router()

// POST
auth.post('/login', (req, res, next) => controller.DoLogin(req, res, next))
auth.post('/register', (req, res, next) => controller.DoRegister(req, res, next))

export default auth