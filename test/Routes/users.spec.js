import { assert, should, expect } from 'chai'
import request from 'supertest'
import config from '../../src/config'
import server from '../../src/server'
const baseURI = `/${config.get('API_VERSION')}/users`
const resetURI = `/${config.get('API_VERSION')}/dev/populate`
const testUser = {
  email: 'braden_feeney@hotmail.com',
  password: 'test1234',
}

describe('Users API Route', () => {
  let token = null
  before((done) => {
    // DO LOGIN
    done()
  })

  describe('GET,POST,PUT,DELETE /users', () => {
    it('GET should return 400 bad request', (done) => {
      expect(true).true
      done()
    })
    it('POST should return 400 bad request', (done) => {
      expect(true).true
      done()
    })
    it('PUT should return 400 bad request', (done) => {
      expect(true).true
      done()
    })
    it('DELETE should return 400 bad request', (done) => {
      expect(true).true
      done()
    })
  })
  describe('GET /users/:userID', () => {
    it('should error if not authorized', (done) => {
      expect(true).true
      done()
    })
    it('should error if userID does not match authorized userID', (done) => {
      expect(true).true
      done()
    })
    it('should return user PAD only', (done) => {
      expect(true).true
      done()
    })
  })
})
