/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */
import userRoute from "./user.route.js";
import callbackRoute from "./callback.route.js"
import onRampTransactionRoute from "./onramp.transaction.route.js"
import offRampTransactionRoute from "./offramp.transaction.route.js"


const routes = async (route, options) => { // route = fastify instance

    route.register(userRoute, { prefix: "/user" })
    route.register(callbackRoute, { prefix: "/callback" })
    route.register(onRampTransactionRoute, { prefix: "/onramp" })
    route.register(offRampTransactionRoute, { prefix: "/offramp" })
};

export default routes;

