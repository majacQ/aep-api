import passport from 'passport'
import jwt from 'jsonwebtoken'
import User from '../models/users.model'
import Workspace from '../models/workspace.model'
// import config from '../config'

const DoLogin = (req, res, next) => {
    passport.authenticate(
        'local',
        { session: false },
        (error, user) => {
            if (error) return res.status(400).json({ error })
            const payload = {
                email: user.email,
                username: user.username
            }
            req.login(payload, { session: false }, (loginError) => {
                if (loginError) return res.status(400).json({ error: loginError })
                // TODO: REPLACE WITH CONFIG BEFORE PUSHING TO REPO
                const token = jwt.sign(JSON.stringify(payload), 'SUPER_AWESOME_KEY_HERE', {
                    // TODO: REPLACE WITH CONFIG BEFORE PUSHING TO REPO
                    expiresIn: '2d',
                })
                res.cookie('jwttkn', jwt, { httpOnly: true, secure: true })
                res.status(200).json({ success: true })
            })
        }
    )(req, res, next)
}

const DoRegister = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body
    Workspace.create({
        name: `${firstName}_${lastName}`
    }, (err, workspace) => {
        if (err) return next(err)
        User.create({
            _workspaceID: workspace._id,
            firstName,
            lastName,
            email,
            password
        }, (userError) => {
            if (userError) return next(userError)
            return res.status(201).json({ success: true })
        })
    })
}

export default {
    DoLogin,
    DoRegister
}