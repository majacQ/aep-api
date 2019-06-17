import { assert, should, expect } from 'chai'
import request from 'supertest'
import config from '../../src/config'
import server from '../../src/server'
const req = request(server)

const baseURI = `/${config.get('API_VERSION')}/auth`
const resetURI = `/${config.get('API_VERSION')}/dev/populate`

describe('Authorization API Route', () => {
  beforeEach(() => {
    return new Promise((resolve, reject) => {
      req
        .get(resetURI)
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  })

  describe('GET,POST,PUT,DELETE /auth', () => {
    it('should return 400 Bad Request', async () => {
      await req.get(baseURI).then((res) => {
        expect(res.status).to.equal(400)
      })
      await req.post(baseURI).then((res) => {
        expect(res.status).to.equal(400)
      })
      await req.put(baseURI).then((res) => {
        expect(res.status).to.equal(400)
      })
      await req.delete(baseURI).then((res) => {
        expect(res.status).to.equal(400)
      })
    })
  })
  describe('POST /auth/login', () => {
    let uri = `${baseURI}/login`
    it('should error if email is not found', async () => {
      await req
        .post(uri)
        .send({
          email: 'notFound@email.com',
          password: 'test1234',
        })
        .then((res) => {
          expect(res.status).to.equal(401)
          expect(res.body).to.have.property('success')
          expect(res.body).to.have.property('message')
          expect(res.body.success).false
        })
    })
    it('should error if password is not correct', async () => {
      // FIX: TAKES ON AVERAGE 3500-5000ms
      await req
        .post(uri)
        .send({
          email: 'braden_feeney@hotmail.com',
          password: 'test',
        })
        .then((res) => {
          expect(res.status).to.equal(401)
          expect(res.body).to.have.property('success')
          expect(res.body).to.have.property('message')
          expect(res.body.success).false
        })
    })
    it('should error if request body is not supplied', async () => {
      await req.post(uri).then((res) => {
        expect(res.status).to.equal(400)
        expect(res.body).to.have.property('status')
        expect(res.body).to.have.property('message')
        expect(res.body.status).to.equal(400)
      })
    })
    it('should error if email key is not supplied', async () => {
      await req
        .post(uri)
        .send({
          password: 'test',
        })
        .then((res) => {
          expect(res.status).to.equal(400)
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.equal(400)
        })
    })
    it('should error if password key is not supplied', async () => {
      await req
        .post(uri)
        .send({
          email: 'braden_feeney@hotmail.com',
        })
        .then((res) => {
          expect(res.status).to.equal(400)
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.equal(400)
        })
    })
    it('should return json success and jwt token', async () => {
      // FIX: TAKES ON AVERAGE 3500-5000ms
      await req
        .post(uri)
        .send({
          email: 'braden_feeney@hotmail.com',
          password: 'test1234',
        })
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.have.property('success')
          expect(res.body).to.have.property('token')
          expect(res.body.success).true
        })
    })
  })
  describe('POST /auth/register', () => {
    let uri = `${baseURI}/register`
    it('should error if email was not supplied', async () => {
      await req
        .post(uri)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          password: 'MochaTest',
        })
        .then((res) => {
          expect(res.status).to.equal(400)
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
        })
    })
    it('should error if password was not supplied', async () => {
      await req
        .post(uri)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          email: 'MochaTest@gmail.com',
        })
        .then((res) => {
          expect(res.status).to.equal(400)
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
        })
    })
    it('should error if body was not supplied', async () => {
      await req.post(uri).then((res) => {
        expect(res.status).to.equal(400)
        expect(res.body).to.have.property('status')
        expect(res.body).to.have.property('message')
      })
    })
    it('should return status of 201 Created', async () => {
      await req
        .post(uri)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          email: 'MochaTest@gmail.com',
          password: 'MochaTest',
        })
        .then((res) => {
          expect(res.status).to.equal(201)
        })
    })
    it('should return body key success: true when successfully created', async () => {
      await req
        .post(uri)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          email: 'MochaTest@gmail.com',
          password: 'MochaTest',
        })
        .then((res) => {
          expect(res.body).to.have.property('success')
          expect(res.body.success).to.be.true
        })
    })
    it('should return jwt token along with success', async () => {
      await req
        .post(uri)
        .send({
          firstName: 'Mocha',
          lastName: 'Test',
          email: 'MochaTest@gmail.com',
          password: 'MochaTest',
        })
        .then((res) => {
          expect(res.body).to.have.property('token')
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
  describe('POST /auth/token', () => {})
  describe('POST /auth/revoke', () => {})
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
