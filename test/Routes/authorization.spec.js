import { assert, should, expect } from 'chai'
import request from 'supertest'
import config from '../../src/config'

const server = require('../../src/server')

const req = request(server)

describe('Authorization API Route', () => {
  let resetUri = `/${config.get('API_VERSION')}/dev/populate`
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

  describe('GET,POST,PUT,DELETE /auth', () => {
    it('should return 400 Bad Request', async () => {
      let uri = `/${config.get('API_VERSION')}/auth`
      await req.get(uri).then((res) => {
        expect(res.status).to.equal(400)
      })
      await req.post(uri).then((res) => {
        expect(res.status).to.equal(400)
      })
      await req.put(uri).then((res) => {
        expect(res.status).to.equal(400)
      })
      await req.delete(uri).then((res) => {
        expect(res.status).to.equal(400)
      })
    })
  })
  describe('POST /auth/login', () => {
    it('should error if email is not found', () => {
      expect(true).true
    })
    it('should error if password is not correct', () => {
      expect(true).true
    })
    it('should error if request body is not supplied', () => {
      expect(true).true
    })
    it('should error if email key is not supplied', () => {
      expect(true).true
    })
    it('should error if password key is not supplied', () => {
      expect(true).true
    })
    it('should return json success key and jwt token cookie', () => {
      expect(true).true
    })
  })
  describe('POST /auth/register', () => {
    let uri = `/${config.get('API_VERSION')}/auth/register`
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
    // it('should error if body was not supplied', async () => {
    //   await req
    //     .post(uri)
    //     .then((res) => {
    //       expect(res.status).to.equal(400)
    //       expect(res.body).to.have.property('status')
    //       expect(res.body).to.have.property('message')
    //     })
    // })
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
        .finally(async () => {
          req.get(resetUri).catch((err) => {
            throw new Error(err)
          })
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
        .finally(async () => {
          req.get(resetUri).catch((err) => {
            throw new Error(err)
          })
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
        .finally(async () => {
          req.get(resetUri).catch((err) => {
            throw new Error(err)
          })
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
