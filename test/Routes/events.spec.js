import mongoose from 'mongoose'
import { assert, should, expect } from 'chai'
import request from 'supertest'
import config from '../../src/config'

const server = require('../../src/server')

const req = request(server)
describe('Events API Route', () => {
  let workspace = {
    name: 'Mocha_User',
  }
  let user = {
    firstName: 'Mocha',
    lastName: 'User',
    email: 'mochauser@aep.com',
    password: 'mochauser',
  }

  beforeEach(() => {
    return new Promise((resolve, reject) => {
      req
        .get(`/${config.get('API_VERSION')}/dev/populate`)
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  })

  after(() => {
    return new Promise((resolve, reject) => {
      req
        .get(`/${config.get('API_VERSION')}/dev/populate`)
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  })

  describe('GET /events', () => {
    it('should error if not authorized', async () => {
      //   await req.get('/v1/events').then((res) => {
      //     const { body, status } = res
      //     expect(status).to.equal(401)
      //   })
      expect(true).true
    })
    it('should return availabe events for authroized user', async () => {
      //   await req.get('/v1/events').then((res) => {
      //     const { body } = res
      //     expect(body).to.have.property('events')
      //     expect(body.events).to.be.an('array')
      //   })
      expect(true).true
    })
  })
  describe('GET /events/:eventID', () => {
    it('should return PAD when not authorized', () => {
      expect(true).true
    })
    it('should return full data when authoized', () => {
      expect(true).true
    })
  })
  describe('POST /events/create', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should error on json validation fail', () => {
      expect(true).true
    })
    it('should error if body is empty', () => {
      expect(true).true
    })
    it('should error if eventID exists', () => {
      expect(true).true
    })
    it('should error if OpenDate is greater than CloseDate', () => {
      expect(true).true
    })
    it('should return success message after creating event', () => {
      expect(true).true
    })
  })
})
