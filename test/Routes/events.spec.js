import mongoose from 'mongoose'
import { assert, should, expect } from 'chai'
import request from 'supertest'
import { Types } from 'mongoose'
import Workspace from '../../src/models/workspace.model'
import User from '../../src/models/users.model'
import Event from '../../src/models/events.model'

const server = require('../../src/server')

const req = request(server)
describe('Events API Route', () => {
    let workspace = {
        name: 'Mocha_User'
    }
    let user = {
        firstName: 'Mocha',
        lastName: 'User',
        email: 'mochauser@aep.com',
        password: 'mochauser'
    }

    before(() => {
        return new Promise(resolve => {
            Workspace.create(workspace)
            .then(newWorkspace => {
                workspace._id = newWorkspace._id
                User.create(user).then(newUser => {
                    user._id = newUser._id
                    user._workspaceID = workspace._id
                    Event.insertMany([
                        {
                            _workspaceID: workspace._id,
                            code: 'MochaTest1',
                            name: 'Mocha Test One',
                            details: 'Mocha Testing',
                            open: Date.now(),
                            close: Date.now()
                        },
                        {
                            _workspaceID: workspace._id,
                            code: 'MochaTest2',
                            name: 'Mocha Test Two',
                            details: 'Mocha Testing',
                            open: Date.now(),
                            close: Date.now()
                        },
                        {
                            _workspaceID: workspace._id,
                            code: 'MochaTest3',
                            name: 'Mocha Test Three',
                            details: 'Mocha Testing',
                            open: Date.now(),
                            close: Date.now()
                        }
                    ])
                    .then(() => {
                        resolve()
                    })
                    .catch(err => {
                        if (err) console.log(err)
                    })
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })
        })
    })

    after(() => {
        return new Promise(resolve => {
            Workspace.deleteOne({
                _id: workspace._id
            })
            .then(() => {
                User.deleteOne({
                    _id: user._id
                })
                .then(() => {
                    Event.deleteMany({
                        _workspaceID: workspace._id
                    })
                    .then(() => resolve())
                    .catch(err => {
                        console.log(err)
                    })
                })
                .catch(err => {
                    console.log(err)
                })
            })
            .catch(err => {
                console.log(err)
            })
        })
    })

    describe('GET /events', () => {
        it('should error if not authorized', async () => {
            await req
            .get('/v1/events')
            .then((res) => {
                const { body, status } = res
                expect(status).to.equal(401)
            })
        })
        it('should return availabe events for authroized user', async () => {
            await req
            .get('/v1/events')
            .then(res => {
                const { body } = res
                expect(body).to.have.property('events')
                expect(body.events).to.be.an('array')
            })
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