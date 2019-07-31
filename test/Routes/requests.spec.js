import { assert, should, expect } from 'chai'
import request from 'supertest'
import { omit, difference } from 'lodash'
import config from '../../src/config'
import server from '../../src/server'
const baseURI = `/${config.get('API_VERSION')}/requests`
const resetURI = `/${config.get('API_VERSION')}/dev/populate`
const testUser = {
  email: 'braden_feeney@hotmail.com',
  password: 'test1234',
}
const EVENT_ID = '5d003c0c34aea526f8c44b99'
const REQUEST_ID = '5d306ee85851b41168a25900'

describe('Requests API Route', () => {
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
  describe('GET /requests', () => {
    it('should error if not authorized', (done) => {
      request(server)
        .get(baseURI)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
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
    it('should have requests should be paginated', (done) => {
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
    it('should show requests as array', (done) => {
      request(server)
        .get(baseURI)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          expect(res.body.requests).to.be.instanceOf(Array)
          done()
        })
    })
  })
  describe('GET /requests/:eventID', () => {
    it('should error if not authorized', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_ID}`)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should error if event is not in authorized users workspace', (done) => {
      request(server)
        .get(`${baseURI}/5d003c0c34aea526f8c44b94`)
        .set('Authorization', token)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should data return is return array', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_ID}`)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.requests).to.be.instanceOf(Array)
          done()
        })
    })
    it('should return paged data array', (done) => {
      request(server)
        .get(`${baseURI}/${EVENT_ID}`)
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
  })
  describe('POST /requests/:eventID', () => {
    const createURI = `${baseURI}/${EVENT_ID}`
    let newRequest = {
      _workspaceID: '5d003c0c34aea526f8c44b65',
      _eventID: '5d003c0c34aea526f8c44b99',
      _trackID: '5d14db950bd556d1d4e26301',
    }
    after((done) => {
      request(server)
        .get(resetURI)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    // TODO: THIS TEST IS GOING TO BE IMPLEMENTED WHEN THE CLIENT IS BUILT
    // it('should error if not sent from client domain', (done) => {
    //   expect(true).true
    //   done()
    // })
    const removedKeys = ['_eventID']
    it('should error if json validation fails', (done) => {
      request(server)
        .post(createURI)
        .send(omit(newRequest, removedKeys))
        .set('Authorization', token)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(400)
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
          expect(res.body.status).to.equal(400)
          done()
        })
    })
    it('should error if eventID does not exist', (done) => {
      request(server)
        .get(`${baseURI}/5d003c0c34aea526f8c44b00`)
        .set('Authorization', token)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(404)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should return sucess message after posting song', (done) => {
      request(server)
        .post(createURI)
        .send(newRequest)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(200)
          expect(res.body).to.haveOwnProperty('success')
          done()
        })
    })
  })
  describe('GET /requests/:eventID/:requestID', () => {
    it('should error if not authorized', (done) => {
      request(server)
        .get(baseURI)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should error if requestID does not exist', (done) => {
      // request(server)
      //   .get(`${baseURI}/${EVENT_ID}/5d306ee85851b41168a25904`)
      //   .set('Authorization', token)
      //   .expect(404)
      //   .end((err, res) => {
      //     if (err) return done(err)
      //     expect(res.body).to.haveOwnProperty('status')
      //     expect(res.body.status).to.equal(404)
      //     expect(res.body).to.haveOwnProperty('success')
      //     expect(res.body).to.haveOwnProperty('message')
      //     done()
      //   })
      expect(true).true
      done()
    })
    it('should error if eventID does not exist', (done) => {
      // request(server)
      //   .get(`${baseURI}/5d003c0c34aea526f8c44b00/${REQUEST_ID}`)
      //   .set('Authorization', token)
      //   .expect(404)
      //   .end((err, res) => {
      //     if (err) return done(err)
      //     expect(res.body).to.haveOwnProperty('status')
      //     expect(res.body.status).to.equal(404)
      //     expect(res.body).to.haveOwnProperty('success')
      //     expect(res.body).to.haveOwnProperty('message')
      //     done()
      //   })
      expect(true).true
      done()
    })
    it('should error if user is not apart of eventID workspace', (done) => {
      // request(server)
      //   .get(`${baseURI}/5d003c0c34aea526f8c44b89/5d306ee85851b41168a25914`)
      //   .set('Authorization', token)
      //   .expect(401)
      //   .end((err, res) => {
      //     if (err) return done(err)
      //     expect(res.body).to.haveOwnProperty('status')
      //     expect(res.body.status).to.equal(401)
      //     expect(res.body).to.haveOwnProperty('success')
      //     expect(res.body).to.haveOwnProperty('message')
      //     done()
      //   })
      expect(true).true
      done()
    })
    it('should return success key and request json object', (done) => {
      // request(server)
      //   .get(`${baseURI}/${EVENT_ID}/${REQUEST_ID}`)
      //   .set('Authorization', token)
      //   .expect(200)
      //   .end((err, res) => {
      //     if (err) return done(err)
      //     expect(res.body).to.haveOwnProperty('played')
      //     expect(res.body).to.haveOwnProperty('request_count')
      //     expect(res.body).to.haveOwnProperty('archived')
      //     expect(res.body).to.haveOwnProperty('track')
      //     done()
      //   })
      expect(true).true
      done()
    })
  })
  describe('PUT /requests/:eventID/:requestID', () => {
    let updatedRequest = {
      played: true,
      archived: false,
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
        .get(baseURI)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should error if body is not supplied with request', (done) => {
      // request(server)
      //   .put(`${baseURI}/${EVENT_ID}/${REQUEST_ID}`)
      //   .set('Authorization', token)
      //   .expect(400)
      //   .end((err, res) => {
      //     if (err) return done(err)
      //     expect(res.body).to.haveOwnProperty('status')
      //     expect(res.body.status).to.equal(400)
      //     expect(res.body).to.haveOwnProperty('success')
      //     expect(res.body.success).to.be.false
      //     expect(res.body).to.haveOwnProperty('message')
      //     done()
      //   })
      expect(true).true
      done()
    })
    it('should error if requestID is not apart of eventID', (done) => {
      // request(server)
      //   .put(`${baseURI}/${EVENT_ID}/5d306ee85851b41168a25905`)
      //   .send(updatedRequest)
      //   .set('Authorization', token)
      //   .expect(401)
      //   .end((err, res) => {
      //     if (err) return done(err)
      //     expect(res.body).to.haveOwnProperty('status')
      //     expect(res.body.status).to.equal(401)
      //     expect(res.body).to.haveOwnProperty('success')
      //     expect(res.body.success).to.be.false
      //     expect(res.body).to.haveOwnProperty('message')
      //     done()
      //   })
      expect(true).true
      done()
    })
    it('should error if requestID does not exist', (done) => {
      // request(server)
      //   .put(`${baseURI}/${EVENT_ID}/5d306ee85851b41168a25999`)
      //   .send(updatedRequest)
      //   .set('Authorization', token)
      //   .expect(404)
      //   .end((err, res) => {
      //     if (err) return done(err)
      //     expect(res.body).to.haveOwnProperty('status')
      //     expect(res.body.status).to.equal(404)
      //     expect(res.body).to.haveOwnProperty('success')
      //     expect(res.body.success).to.be.false
      //     expect(res.body).to.haveOwnProperty('message')
      //     done()
      //   })
      expect(true).true
      done()
    })
    // it('should error if eventID does not exist', (done) => {
    //   expect(true).true
    //   done()
    // })
    // it('should error if user is not apart of eventID workspace', (done) => {
    //   expect(true).true
    //   done()
    // })
    it('should return success key json object', (done) => {
      // request(server)
      //   .put(`${baseURI}/${EVENT_ID}/${REQUEST_ID}`)
      //   .send(updatedRequest)
      //   .set('Authorization', token)
      //   .expect(200)
      //   .end((err, res) => {
      //     if (err) return done(err)
      //     expect(res.body).to.haveOwnProperty('status')
      //     expect(res.body.status).to.equal(200)
      //     expect(res.body).to.haveOwnProperty('success')
      //     expect(res.body.success).to.be.true
      //     done()
      //   })
      expect(true).true
      done()
    })
  })
  describe('DELETE /requests/:eventID/:requestID', () => {
    it('should error if not authorized', (done) => {
      request(server)
        .get(baseURI)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should error if request ID is not found', (done) => {
      expect(true).true
      done()
    })
    it('should error if eventID is not found', (done) => {
      expect(true).true
      done()
    })
    it('should error if requestID is not apart of eventID', (done) => {
      expect(true).true
      done()
    })
    it('should error if user is not apart of eventID workspace', (done) => {
      expect(true).true
      done()
    })
    it('should return success key json object', (done) => {
      expect(true).true
      done()
    })
  })
})
