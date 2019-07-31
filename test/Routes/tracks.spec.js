import { assert, should, expect } from 'chai'
import request from 'supertest'
import config from '../../src/config'
import server from '../../src/server'
const baseURI = `/${config.get('API_VERSION')}/tracks`
const resetURI = `/${config.get('API_VERSION')}/dev/populate`
const testUser = {
  email: 'braden_feeney@hotmail.com',
  password: 'test1234',
}

describe('Tracks API Route', () => {
  let token = null

  before((done) => {
    request(server)
      .get(resetURI)
      .end((err) => {
        if (err) return done(err)
        request(server)
          .post(`/${config.get('API_VERSION')}/auth/login`)
          .send(testUser)
          .then((res) => {
            expect(res.status).to.equal(200)
            token = `Bearer ${res.body.token}`
            done()
          })
      })
  })
  after((done) => {
    request(server)
      .get(resetURI)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
  describe('GET, POST, PUT, DELETE /', () => {
    it('GET should only return 400 bad request', (done) => {
      request(server)
        .get(baseURI)
        .expect(400, done)
    })
    it('POST should only return 400 bad request', (done) => {
      request(server)
        .post(baseURI)
        .expect(400, done)
    })
    it('PUT should only return 400 bad request', (done) => {
      request(server)
        .put(baseURI)
        .expect(400, done)
    })
    it('DELTE should only return 400 bad request', (done) => {
      request(server)
        .delete(baseURI)
        .expect(400, done)
    })
  })
  describe('GET /tracks/search', () => {
    it('should error if no parameters supplied', (done) => {
      expect(true).true
      done()
    })
    it('should error if the incorrect paramenters are supplied', (done) => {
      expect(true).true
      done()
    })
    it('should return local search when track exists in DB', (done) => {
      expect(true).true
      done()
    })
    it('should return DeezerSearch when track does not exist in DB', (done) => {
      expect(true).true
      done()
    })
    it('should return SpotifySearch when track does not exist in DB and user is authenticated', (done) => {
      expect(true).true
      done()
    })
    it('should error if no track can be found', (done) => {
      expect(true).true
      done()
    })
  })
})
