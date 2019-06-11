import Events from '../models/events.model'

const GetEvents = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        resolve(await Events.find({ _workspaceID: '5cffd724323f5b57f895d5ff'}))
    })
}

const CreateEvent = (req, res, next) => {

}

const UpdateEvent = (req, res, next) => {

}

const DeleteEvent = (req, res, next) => {

}

export default {
    GetEvents,
    CreateEvent,
    UpdateEvent,
    DeleteEvent
}