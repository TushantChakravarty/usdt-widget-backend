/**
 * Middleware for JWT authentication.
 * Provides JWT authentication middleware for Fastify.
 * @file JWT Authentication Plugin
 * @module JWT Authentication Plugin
 * @category plugins
 * @subcategory authentication
 */

import fastifyPlugin from "fastify-plugin";
import fastifyJWT from "@fastify/jwt";
import logger from "../utils/logger.util.js";
import { authFetch } from "../ApiCalls/authFetch.js";
import db from "../models/index.js";
const { User } = db

export default fastifyPlugin(async function (fastify, opts) {
    fastify.register(fastifyJWT, {
        secret: process.env.JWT_SECRET,
        sign: {
            expiresIn: "30d",
        },
        verify: {
            maxAge: "30d",
            extractToken: function (request, reply) {
                let token = null;
                if (request?.cookies?.token) {
                    token = request.cookies.token;
                }
                if (request?.headers?.authorization) {
                    token = request.headers.authorization;
                }
                return token;
            },
        },
    });

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            // Step 1: Verify JWT
            const decodedToken = await request.jwtVerify();

            const user = await User.scope("private").findOne({
                where: { id: decodedToken.id },
            });

            if (!user) {
                return reply.status(403).send({ message: 'Unauthorized' });
            }

            // Instead of decorating the request, just assign the user object directly
            request.user = user;
        } catch (err) {
            // reply.send(err);
            console.log(err);
            logger.error(`JWT Error authenticating user: ${err.message}`);
            return reply.status(401).send(new Error("Unauthorized"));
        }
    });
});




export const validateToken = async (request, reply) => {
    try {


    } catch (err) {
        console.log(err);
        return reply.status(403).send({ message: 'Your session expired' });
    }
};
