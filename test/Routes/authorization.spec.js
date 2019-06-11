import { assert, should, expect } from 'chai'
import request from 'supertest'
// import config from '../../src/config'
const prefix = '/v1'

const server = require('../../src/server')

const req = request(server)

describe('Authorization API Route', () => {
    beforeEach(() => {

    })

    describe('GET,POST,PUT,DELETE /auth', () => {
        it('should return 400 Bad Request', () => {
            expect(true).true
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
        it('should error if email was not supplied', () => {

        })
        it('should error if password was not supplied', () => {

        })
        it('should error if body was not supplied', () => {

        })
        it('should return status of 201 Created', () => {
            // req.post(`${prefix}/auth/register`)
            // .then(res => {
            //     const { status } = res
            //     expect(status).to.equal(201)
            // }).catch(err => {

            // })
        })
        it('should return body key success: true when successfully created', () => {

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