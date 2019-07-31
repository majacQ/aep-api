import { assert, should, expect } from 'chai'
import request from 'supertest'
import { omit, difference } from 'lodash'
import config from '../../src/config'
import server from '../../src/server'
const baseURI = `/${config.get('API_VERSION')}/events`
const resetURI = `/${config.get('API_VERSION')}/dev/populate`
const testUser = {
  email: 'braden_feeney@hotmail.com',
  password: 'test1234',
}
const EVENT_ID = '5d003c0c34aea526f8c44b99'
const EVENT_CODE = 'TOYS'

describe('Event API Route', () => {
  let token = null

  before((done) => {
    request(server)
      .post(`/${config.get('API_VERSION')}/auth/login`)
      .send(testUser)
      .then((res) => {
        expect(res.status).to.equal(200)
        token = `Bearer ${res.body.token}`
        request(server)
          .get(resetURI)
          .end((err) => {
            if (err) return done(err)
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
  describe('GET /events', () => {
    it('should error if not authorized', (done) => {
      request(server)
        .get(baseURI)
        .expect(401, done)
    })
    it('should respond with JSON', (done) => {
      request(server)
        .get(baseURI)
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.be.instanceOf(Object)
          done()
        })
    })
    it('should have events be paginated', (done) => {
      request(server)
        .get(baseURI)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('hasNextPage')
          expect(res.body).to.haveOwnProperty('hasPrevPage')
          expect(res.body).to.haveOwnProperty('limit')
          expect(res.body).to.haveOwnProperty('nextPage')
          expect(res.body).to.haveOwnProperty('prevPage')
          expect(res.body).to.haveOwnProperty('page')
          expect(res.body).to.haveOwnProperty('totalPages')
          done()
        })
    })
    it('should show events as array', (done) => {
      request(server)
        .get(baseURI)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.events).to.be.instanceOf(Array)
          done()
        })
    })
  })
  describe('GET /events/:eventID', () => {
    it('should return the event when the ID is used', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_ID}`)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should return the event when the CODE is used', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_CODE}`)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should respond with JSON', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_ID}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.be.instanceOf(Object)
          done()
        })
    })
    it('should return PAD when not authorized', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_ID}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('code')
          expect(res.body).to.haveOwnProperty('name')
          expect(res.body).to.haveOwnProperty('details')
          expect(res.body).to.haveOwnProperty('open')
          expect(res.body).to.haveOwnProperty('close')
          done()
        })
    })
    it('should return full data when authoized', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_ID}`)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('_workspace')
          expect(res.body).to.haveOwnProperty('code')
          expect(res.body).to.haveOwnProperty('name')
          expect(res.body).to.haveOwnProperty('details')
          expect(res.body).to.haveOwnProperty('open')
          expect(res.body).to.haveOwnProperty('close')
          expect(res.body).to.haveOwnProperty('createdAt')
          expect(res.body).to.haveOwnProperty('updatedAt')
          done()
        })
    })
    it('should have the same code when code is used in url', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_CODE}`)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.code).to.equal(EVENT_CODE)
          done()
        })
    })
    it('should error if the eventID does not exist', (done) => {
      request(server)
        .get(`${baseURI}/5d003c0c34aea526f8c44b00`)
        .set('Authorization', token)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should error if the event code does not exist', (done) => {
      request(server)
        .get(`${baseURI}/DOESNOTEXIST`)
        .set('Authorization', token)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
  })
  describe('POST /events/create', () => {
    const createURI = `${baseURI}/create`
    let newEvent = {
      code: 'MOCHA',
      name: 'MOCHA TEST EVENT',
      details: 'THIS IS A MOCHA TESTING EVENT FROM UNIT TESTING',
      open: '2019-08-12T17:00:00.891Z',
      close: '2019-08-12T18:00:00.891Z',
    }
    after((done) => {
      request(server)
        .get(resetURI)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should error if not authorized', (done) => {
      request(server)
        .post(createURI)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    const removedKeys = ['code', 'open']
    it('should error on json validation fail', (done) => {
      request(server)
        .post(createURI)
        .send(omit(newEvent, removedKeys))
        .set('Authorization', token)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(400)
          done()
        })
    })
    it('should have corrisponding error messages to unvalid keys', (done) => {
      request(server)
        .post(createURI)
        .send(omit(newEvent, removedKeys))
        .set('Authorization', token)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(difference(res.body.error, removedKeys).length).to.be.lessThan(
            1,
          )
          expect(res.body.error.length).to.equal(res.body.message.length)
          done()
        })
    })
    it('should error if body is empty', (done) => {
      request(server)
        .post(createURI)
        .set('Authorization', token)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body).to.haveOwnProperty('message')
          expect(res.body).to.haveOwnProperty('error')
          expect(res.body.error.length).to.equal(res.body.message.length)
          done()
        })
    })
    it('should error if eventID exists', (done) => {
      newEvent.code = 'TOYS'
      request(server)
        .post(createURI)
        .send(newEvent)
        .set('Authorization', token)
        .expect(409)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body).to.haveOwnProperty('message')
          newEvent.code = 'MOCHA'
          done()
        })
    })
    it('should error if OpenDate is greater than CloseDate', (done) => {
      newEvent.open = '2019-08-13T17:00:00.891Z'
      newEvent.close = '2019-08-12T18:00:00.891Z'
      request(server)
        .post(createURI)
        .send(newEvent)
        .set('Authorization', token)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body).to.haveOwnProperty('message')
          expect(res.body).to.haveOwnProperty('error')
          expect(res.body.error.length).to.equal(res.body.message.length)
          newEvent.open = '2019-08-12T17:00:00.891Z'
          newEvent.close = '2019-08-12T18:00:00.891Z'
          done()
        })
    })
    it('should return success message after creating event', (done) => {
      request(server)
        .post(createURI)
        .send(newEvent)
        .set('Authorization', token)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body).to.haveOwnProperty('success')
          done()
        })
    })
  })
})
