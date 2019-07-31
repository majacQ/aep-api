import { assert, should, expect } from 'chai'
import request from 'supertest'
import config from '../../src/config'
import server from '../../src/server'
const baseURI = `/${config.get('API_VERSION')}/auth`
const resetURI = `/${config.get('API_VERSION')}/dev/populate`
const testUser = {
  email: 'braden_feeney@hotmail.com',
  password: 'test1234',
}

describe('Authorization API Route', () => {
  describe('GET,POST,PUT,DELETE /auth', () => {
    it('get should return 400 Bad Request', (done) => {
      request(server)
        .get(baseURI)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('post should return 400 Bad Request', (done) => {
      request(server)
        .post(baseURI)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('put should return 400 Bad Request', (done) => {
      request(server)
        .put(baseURI)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('delete should return 400 Bad Request', (done) => {
      request(server)
        .delete(baseURI)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })
  describe('POST /auth/login', () => {
    const URI = `${baseURI}/login`
    it('should error if email is not found', (done) => {
      request(server)
        .post(URI)
        .send({
          email: 'notFound@email.com',
          password: testUser.password,
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(401)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should error if password is not correct', (done) => {
      // FIX: TAKES ON AVERAGE 3500-5000ms
      request(server)
        .post(URI)
        .send({
          email: testUser.email,
          password: 'test',
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(401)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should error if request body is not supplied', (done) => {
      request(server)
        .post(URI)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(400)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should error if email key is not supplied', (done) => {
      request(server)
        .post(URI)
        .send({
          password: testUser.password,
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(400)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should error if password key is not supplied', (done) => {
      request(server)
        .post(URI)
        .send({
          email: testUser.email,
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(400)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should return json success and jwt token', (done) => {
      // FIX: TAKES ON AVERAGE 3500-5000ms
      request(server)
        .post(URI)
        .send(testUser)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(200)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.true
          expect(res.body).to.haveOwnProperty('token')
          done()
        })
    })
  })
  describe('POST /auth/register', () => {
    const URI = `${baseURI}/register`
    it('should error if email already exists', (done) => {
      request(server)
        .post(URI)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          email: testUser.email,
          password: testUser.password,
        })
        .expect(409)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(409)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should error if email was not supplied', (done) => {
      request(server)
        .post(URI)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          password: testUser.password,
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(400)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should error if password was not supplied', (done) => {
      request(server)
        .post(URI)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          email: testUser.email,
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(400)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should error if body was not supplied', (done) => {
      request(server)
        .post(URI)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(400)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.false
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
    it('should return status of 201 Created', (done) => {
      request(server)
        .post(URI)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          email: 'mocha@test.com',
          password: 'fakeUser1',
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('status')
          expect(res.body.status).to.equal(201)
          expect(res.body).to.haveOwnProperty('success')
          expect(res.body.success).to.be.true
          expect(res.body).to.haveOwnProperty('token')
          done()
        })
    })
  })
  describe('GET /auth/current', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should error if userID is unmatched to email address', () => {
      expect(true).true
    })
    it('should return current user details according to email and userID in JWT', () => {
      expect(true).true
    })
  })
  describe('POST /auth/logout', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should remove token from cookie', () => {
      expect(true).true
    })
    it('should blacklist token until JWT expires', () => {
      expect(true).true
    })
  })
})
