/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */
import userRoute from "./user.route.js";
import callbackRoute from "./callback.route.js"


const routes = async (route, options) => { // route = fastify instance

    route.register(userRoute, { prefix: "/user" })
    route.register(callbackRoute, { prefix: "/callback" })
};

export default routes;

