import convict from 'convict'
import path from 'path'

const config = convict({
    NODE_ENV: {
        doc: 'Environment the Application is running on',
        format: String,
        default: 'development'
    },
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
            format: String,
            default: ''
        },
        COLLECTION: {
            doc: 'Database Collection',
            format: String,
            default: 'aep-dev'
        }
    },
    SECURITY: {
        SALT_ROUNDS: {
            doc: 'Number of rounds of salt taken',
            format: Number,
            default: 15
        },
        SECRET: {
            doc: 'Super Secret Decrypt Key',
            format: String,
            default: 'NOT-SECRET'
        },
        JWT: {
            EXPIRES_IN: {
                doc: 'JWT Token Expire Time',
                format: String,
                default: '2d'
            }
        }
    }
})

const env = config.get('env')
config.loadFile(path.join(__dirname, `/${env}.config.json`))

config.validate({ allowed: 'strict' })

module.exports = config
