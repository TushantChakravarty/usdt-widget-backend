/**
 * Main entry point for the Play999 API.
 * It sets up the Fastify server, registers plugins,
 * imports routes, and starts the server.
 * 
 * @file App.js
 * @module app
 * @category app
 * @subcategory main
 * @requires fastify
 */
import dotenv from 'dotenv'
dotenv.config() // load environment variables from .env file

import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import routes from './routes'
import fastifyStatic from '@fastify/static'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import handleErrors from './utils/error-handler.util.js'
import jwtAuthPlugin from "./plugins/jwt-auth.plugin.js"
import RBAMPlugin from "./plugins/rbam.plugin.js"
 import redisPlugin from './plugins/redis.plugin.js'
import multipart from '@fastify/multipart'
import fastifyJwt from '@fastify/jwt'
import path from 'path'
import logger from './utils/logger.util.js'
import migrateDb from './utils/db.util.js'
import amqp from 'amqplib'
// import { executePayment } from './gateways/yellowCard.js'
//import cron from './utils/cron/index.js'
import { responseMappingError } from './utils/responseMapper.js'
import { sendOtp } from '../otpTest.js'
import { getRates, getRatesAfrica } from './gateways/yellowCard.js'
// import { createTronWallet, generateTransaction, verifyTransaction } from './controllers/offramp.controller.js'
// import { getRecipientAddressUsingTronscan, getRecipientAddressWeb3, transferUSDT } from './utils/tronUtils.js'
// import { sendFundTransferRequest } from './gateways/gennpayPayout.js'
// import { sumTodaySuccessTransactions } from './services/metrics.service.js'
process.env.TZ = "Asia/Kolkata" // set timezone


// await executePayment()

// sendFundTransferRequest(
//     '7b7d2684-ff99-46ae-9a1e-3b10fe101b6e',
//     '753235687799',
//     '100.00',
//     '50100771180561',
//     'HDFC0009640',
//     'IMPS',
//     {
//         accountName: 'Tushant chakraborty',
//         bankName: 'HDFC',
//     }
//   );
/**
 * Fastify server instance
 * @type {FastifyInstance}
 */
export const server = Fastify({
    logger
})
//generateTransaction()
//createTronWallet()
//verifyTransaction()
//getRecipientAddressWeb3('5a8f3817af2446afdc359d5ba7280e7d3f7b93c4feb57fd6d711abe25c457f93')
//getRecipientAddressUsingTronscan('5a8f3817af2446afdc359d5ba7280e7d3f7b93c4feb57fd6d711abe25c457f93')
server.setErrorHandler(function (error, request, reply) {
  // Check if it's a validation error
  if (error.validation && error.validation.length > 0) {
    const validationError = error.validation[0]; // Get the first validation error
    console.log(error)
    // Extract the field name and ensure the message is present
    let field =""
    let message =""
    if(validationError.instancePath.length>0)
    field = validationError.instancePath.replace('/', '') || 'unknown field';
    const validationMessage = validationError.message || 'Validation error';

    // Construct a custom message like 'password: must NOT have fewer than 8 characters'
    if(validationError.instancePath.length>0)
     message = `${field}: ${validationMessage}`
    else
    message = `${validationMessage}`

    // Log the error to debug if needed
    console.log("Validation Error:", validationError);

    // Send a custom response
    reply.status(400).send(
      responseMappingError(400, message) 
    );
  } else {
    // Handle other errors (non-validation errors)
    reply.status(400).send(
      responseMappingError(400, error.message || 'Unknown error')
    );
  }
});


server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });
/**
 * Register custom error handler
 */
//handleErrors(server)

/**
 * Multipart form data plugin (for file uploads)
 */
await server.register(multipart)

/**
 * Register cookie plugin
 */

await server.register(cookie, {
    secret: process.env.COOKIE_SECRETS.split(","), // array of keys to be used for cookies signature
})

/**
 * Register redis caching plugin
 */
 await server.register(redisPlugin)
 await server.register(require('@fastify/formbody')); // Enables parsing of URL-encoded form data

// await server.register(fastifyJwt, {
//     secret: 'hereismysecretkey'
// })

/** 
 * Setup static/public directory
 */
await server.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
    // constraints: { host: 'example.com' } // optional: default {}
})

/**
 * Register rate-limit plugin
 * Limit requests to the server by IP address. We'll also set request limit on server level. This will limit the number of requests to the server from a single IP address. This is useful to prevent brute-force/DDOS attacks.
 * @see https://github.com/fastify/fastify-rate-limit
 */
// await server.register(rateLimit, {
//     max: 100, // max requests per windowMs
//     timeWindow: '1 minute', // windowMs: milliseconds - how long to keep records of requests in memory
//     cache: 10000, // number of max entries in the global cache
//     // allowList: ['127.0.0.1'], // default []
//     nameSpace: 'play999-api-ratelimit-', // default is 'fastify-rate-limit-'
//     // keyGenerator: function (request) { /* ... */ }, // default (request) => request.raw.ip. TODO: make sure user's ip is accessible behind nginx proxy, if not then use request.headers['x-forwarded-for'] || request.ip
// })

/**
 * Register swagger plugin
 */
await server.register(swagger)

await server.register(swaggerUi, {
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'Usdt market place Documentation',
            description: 'usdt market place API Documentation',
            version: '0.1.0',
            termsOfService: 'https://example.com/tos',
            contact: {
                name: 'John Doe',
                url: 'https://www.example.com',
                email: 'john.doe@email.com'
            }
        },
        externalDocs: {
            url: 'https://www.example.com/api/',
            description: 'Find more info here'
        },
        host: '127.0.0.1:3000',
        basePath: '',
        schemes: ['http', 'https'],
    },
    uiConfig: {
        docExpansion: 'list', // expand/not all the documentations none|list|full
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (request, reply, next) {
            next()
        },
        preHandler: function (request, reply, next) {
            next()
        }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true
})

/**
 * Register JWT middleware
 */
//await server.register(jwtAuthPlugin)

/**
 * Register RBAM (Role-Based Access Management) middleware
 */
await server.register(RBAMPlugin)


//await migrateDb()

/**
 * Register server-cors plugin
 */
await server.register(cors, {
    // TODO: Setup CORS options before deploying to production
    // origin: 'https://example.com', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
    // allowedHeaders: ['Content-Type'], // Allow specified request headers
    // exposedHeaders: ['Content-Length'], // Expose specified response headers
    // credentials: true, // Enable sending credentials (cookies, HTTP authentication) in cross-origin requests
    // preflightContinue: false, // Disable handling of preflight requests
    // optionsSuccessStatus: 204 // Set the response status code for successful OPTIONS requests
})

/**
 * Register routes
 */
await server.register(routes, { prefix: "/api/v1" })

await server.get('/', async (request, reply) => {
    const state_code = request.headers['X-State-Code'] || 'Unknown';
    // Use state code in your application logic
    return reply.send({
        message: 'Hello world.1',
        environment: process.env.NODE_ENV,
    })

}) // root route



await migrateDb()
// sendOtp(1124,'shubhanshu.tripathi@polarisgrids.com')
// .catch((error)=>{
//     console.log('errrrrrrrrrrror',error)
// })
// generateAadhaarOTP('12887788998877',"355107134580")
// await executePayment()
//getRatesAfrica('fiat','NGN')



// console.log("jere ksskslks",await sumTodaySuccessTransactions())

/** 
 * Handle uncaught exceptions and unhandled promise rejections 
 */
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    logger.error(`Error: ${err.message}`)
    server.close(() => process.exit(1)); // close server & exit process: mandatory (as per the Node.js docs)
})

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    logger.error(`Error: ${err.message}`)
    server.close(() => process.exit(1))
})


/** 
 * Run the server! 
 */
const start = async () => {
    try {
        server.listen({
            port: 3000,
            host: '0.0.0.0',
        })
    } catch (err) {
        logger.error(`server error: ${err}`)
        process.exit(1)
    }
}
start()

/**
 * Run swagger!
 */
server.ready(err => {
    if (err) throw err
    server.swagger()
})



