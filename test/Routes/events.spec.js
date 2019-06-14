import { assert, should, expect } from 'chai'
// import request from 'supertest'
// import config from '../../src/config'
// import server from '../../src/server'
// const req = request(server)
// const baseURI = `/${config.get('API_VERSION')}/events`

describe('Event API Route', () => {
  describe('GET /events', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should return availabe events for authroized user', () => {
      expect(true).true
    })
    it('should events should be paginated', () => {
      expect(true).true
    })

    it('should events should be paginated', () => {
      expect(true).true
    })
    it('should show events as array', () => {
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
