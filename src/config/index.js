import convict from 'convict'
import path from 'path'

const config = convict({
    env: {
        doc: 'AEP Environments',
        format: ['production', 'development', 'testing'],
        default: 'development',
        env: 'NODE_ENV'
    },
    API_HOST: {
        doc: 'The Host IP Address to Bind',
        format: 'ipaddress',
        default: '0.0.0.0',
        env: 'API_HOST'
    },
    API_PORT: {
        doc: 'The Post to Bind',
        format: 'port',
        default: 3000,
        env: 'API_PORT'
    },
    DB: {
        STRING: {
            doc: 'Database Connection String',
            format: '*',
            default: ''
        },
        COLLECTION: {
            doc: 'Database Collection',
            format: String,
            default: 'aep-dev'
        }
    }
})

const env = config.get('env')
config.loadFile(path.join(__dirname, `/${env}.config.json`))

config.validate({ allowed: true })

module.exports = config