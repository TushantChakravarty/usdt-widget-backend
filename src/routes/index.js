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
import adminRoutes from "./admin.route.js"
import kycRoutes from "./kyc.route.js"
import offrampAfrica from "./offramp.africa.route.js"




const routes = async (route, options) => { // route = fastify instance

    route.register(userRoute, { prefix: "/user" })
    route.register(kycRoutes, { prefix: "/user/kyc" })
    route.register(callbackRoute, { prefix: "/callback" })
    route.register(onRampTransactionRoute, { prefix: "/onramp" })
    route.register(offRampTransactionRoute, { prefix: "/offramp" })
    route.register(offrampAfrica, { prefix: "/africa/offramp" })
    route.register(adminRoutes, { prefix: "/admin" })

};

export default routes;

