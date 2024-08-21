/**
 * Middleware for RBAM (Role-Based Access Management).
 * Provides RBAM middleware for Fastify to check user roles and access fields.
 * @file RBAM Plugin
 * @module RBAM Plugin
 * @category plugins
 * @subcategory authentication
 */

import fastifyPlugin from "fastify-plugin";
import logger from "../utils/logger.util.js";
export default fastifyPlugin(async function (fastify, opts) {
    fastify.decorate("rbam", async function (request, reply) {
        try {
            const accessRoles = request?.accessRoles || [];
            const accessFields = request?.accessFields || [];

            // Check if the user has the necessary role to access the route
            if (accessRoles && accessRoles?.length > 0 && !accessRoles?.includes(request.user?.role)) {
                return reply.status(403).send(new Error("Forbidden"));
            }

            // If request.user is admin, check if at least one of the accessFields is present in the user's access object and is true.
            if (request.user?.role === "admin" && accessFields && accessFields?.length > 0 && !accessFields?.some((field) => request.user?.access[field] === true)) {
                return reply.status(403).send(new Error("Forbidden"));
            }
        } catch (err) {
            console.log(err);
            logger.error(`RBAM Error: ${err.message}`);
            return reply.status(401).send(new Error("Unauthorized"));
        }
    });
});

// function setAccessRolesAndFields(allowedRoles, allowedFields) {
//     //     return async function (request, reply) {
//     //         request.accessRoles = allowedRoles;
//     //         request.accessFields = allowedFields;
//     //     };
//     // }
// TODO: IN FUTURE WE CAN USE THIS FUNCTION AS A MIDDLEWARE    