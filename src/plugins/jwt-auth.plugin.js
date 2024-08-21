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
            const decoded = await request.jwtVerify();
            const userId = decoded?.id || null;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized " });
            }

            // Step 2: Find User
            const user = await authFetch.get(`${process.env.USER_MS_BASE_URL}/user/microservice/user/user-info/${userId}`)
            if (!user) {
                return reply.status(401).send({ error: "Unauthorized" });
            }

            // Step 3: Check if user is banned
            if (user.is_banned) {
                reply.clearCookie("token");
                return reply.status(403).send({ error: "Your account has been banned. If you believe this is a mistake, please contact us." });
            }

            const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip
            const country_code = request.headers["x-country-code"]
            // if (user.role !== 'admin') {
            //     // const country_banned = await Country.findOne({ where: { country_code: country_code, banned: true } })
            //     // if (country_code !== "IN") return reply.status(403).send({ error: "Sorry, this app is not accessible in your country" })
            //     const userStateCode = user.ip_state_code
            //     if (userStateCode) {
            //         const state = await States.findOne({
            //             where: {
            //                 state_code: userStateCode
            //             }
            //         })
            //         if (state.banned) return reply.status(403).send({ error: "Sorry, this app is not accessible in your state." })
            //     }
            // }
            // TODO: verify user db token with jwt for single device login. Store jwt in db at the time of login and check if it matches
            // if (user.token !== jwt) 

            // 5. update user last_active, ip, user_agent

            // await user.update({
            //     last_active: new Date(),
            //     ip,
            //     user_agent: request.headers["user-agent"],
            // });
            const user_updated = await authFetch.put(`${process.env.USER_MS_BASE_URL}/user/microservice/user/update/${user.id}`, {
                ip,
                user_agent: request.headers["user-agent"],
            })
            if (!user_updated) {
                return reply.status(500).send(new Error("Internal server error"))
            }

            // 6. Add the user to the request object
            request.user = user;
        } catch (err) {
            // reply.send(err);
            console.log(err);
            logger.error(`JWT Error authenticating user: ${err.message}`);
            return reply.status(401).send(new Error("Unauthorized"));
        }
    });
});


