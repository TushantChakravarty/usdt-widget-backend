/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */
import userRoute from "./user.route.js";



const routes = async (route, options) => { // route = fastify instance
    route.register(userRoute, { prefix: "/user" })
};

export default routes;

