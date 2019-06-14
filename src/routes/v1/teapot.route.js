import express from 'express'

const teapot = express.Router()

teapot.get('/', (req, res, next) => {
    return res.status(418).json({
        message: 'I am not attempting to brew coffee in a teapot!'
    })
})


export default teapot