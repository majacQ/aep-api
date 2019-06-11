const assert = require('chai').assert
const should = require('chai').should
const expect = require('chai').expect

describe('Users API Route', () => {
    beforeEach(() => {

    })

    describe('GET,POST,PUT,DELETE /users', () => {
        it('should return 403 bad request', () => {
            expect(true).true
        })
    })
    describe('GET /users/:userID', () => {
        it('should error if not authorized', () => {
            expect(true).true
        })
        it('should error if userID does not match authorized userID', () => {
            expect(true).true
        })
        it('should return user PAD only', () => {
            expect(true).true
        })
    })
})