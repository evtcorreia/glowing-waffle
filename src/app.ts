import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import 'dotenv/config'
import express, { type Express } from 'express'
import forceSSL from 'express-force-ssl'
import helmet from 'helmet'
import morgan from 'morgan'
import multer from 'multer'
import swaggerUi from 'swagger-ui-express'

import { config } from '@shared/config'

import { EnvValidator } from '@shared/env/env-validator'
import { swagger } from '../docs/swagger'
import { routes } from './api'
import { AppErrorHandling } from './middlewares/error-handling.middleware'

const app: Express = express()
const env = config.env
const upload = multer()

if (env === 'production' || env === 'staging') {
  EnvValidator()
}

/**
 * Set up middlewares
 */

const possibleEnvs = {
  DEV: 'dev',
  STAGING: 'staging',
  PRODUCTION: 'production',
}

const isForceSSL = !!(env === possibleEnvs.PRODUCTION || env === possibleEnvs.STAGING)

if (isForceSSL) {
  app.set('forceSSLOptions', {
    enable301Redirects: true,
    trustXFPHeader: false,
    httpsPort: 443,
    sslRequiredMessage: 'SSL Required.',
  })
  app.use(forceSSL)
}

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(upload.single('file'))
app.disable('x-powered-by')

/**
 * Set up static files and docs
 */

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

/**
 * Set up routes
 */

app.use(routes)

/**
 * Set up error handling
 */

app.use(AppErrorHandling)

export { app }
