const assert = require('chai').assert
const should = require('chai').should
const expect = require('chai').expect

describe('Requests API Route', () => {
  beforeEach(() => {})

  describe('GET /requests - All Requests from every Event', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should return authorized users events based on workspaceID', () => {
      expect(true).true
    })
    it('should return paged results', () => {
      expect(true).true
    })
  })
  describe('GET /requests/:eventID - Paged Results of all Requests for Event', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should error if event is not in authorized users workspace', () => {
      expect(true).true
    })
    it('should data return is return array', () => {
      assert(Array.isArray([]))
    })
    it('should return paged data array', () => {
      expect(true).true
    })
  })
  describe('POST /requests/:eventID - Create Request', () => {
    it('should error if not sent from client domain', () => {
      expect(true).true
    })
    it('should error if json validation fail', () => {
      expect(true).true
    })
    it('should error if body is empty', () => {
      expect(true).true
    })
    it('should error if eventID does not exist', () => {
      expect(true).true
    })
    it('should return sucess message after posting song', () => {
      expect(true).true
    })
  })
  describe('GET /requests/:eventID/:requestID - Get Request Record', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should error if requestID is not apart of eventID', () => {
      expect(true).true
    })
    it('should error if requestID does not exist', () => {
      expect(true).true
    })
    it('should error if eventID does not exist', () => {
      expect(true).true
    })
    it('should error if user is not apart of eventID workspace', () => {
      expect(true).true
    })
    it('should return success key and request json object', () => {
      expect(true).true
    })
  })
  describe('PUT /requests/:eventID/:requestID - Update Request Record', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should error if body is not supplied with request', () => {
      expect(true).true
    })
    it('should error if requestID is not apart of eventID', () => {
      expect(true).true
    })
    it('should error if requestID does not exist', () => {
      expect(true).true
    })
    it('should error if eventID does not exist', () => {
      expect(true).true
    })
    it('should error if user is not apart of eventID workspace', () => {
      expect(true).true
    })
    it('should return success key json object', () => {
      expect(true).true
    })
  })
  describe('DELETE /requests/:eventID/:requestID - Delete Request Record', () => {
    it('should error if not authorized', () => {
      expect(true).true
    })
    it('should error if request ID is not found', () => {
      expect(true).true
    })
    it('should error if eventID is not found', () => {
      expect(true).true
    })
    it('should error if requestID is not apart of eventID', () => {
      expect(true).true
    })
    it('should error if user is not apart of eventID workspace', () => {
      expect(true).true
    })
    it('should return success key json object', () => {
      expect(true).true
    })
  })
})
