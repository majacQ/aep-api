import express from 'express'
import controller from '../../controllers/requests.controller'

const requests = express.Router()

// GET
requests.get('/', async (req, res, next) => controller.ListRequests(req, res, next))
requests.get('/:eventID', async (req, res, next) => controller.GetRequest(req, res, next))

// POST
requests.post('/:eventID', async (req, res, next) => controller.CreateRequest(req, res, next))

// PUT
requests.put('/:eventID/:requestID', async (req, res, next) => controller.UpdateRequest(req, res, next))

// DELETE
requests.delete('/:eventID/:requestID', async (req, res, next) => controller.DeleteRequest(req, res, next))

export default requests