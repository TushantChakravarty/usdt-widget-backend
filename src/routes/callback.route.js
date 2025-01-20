/**
 * Router for callback-related endpoints.
 * @file callback Routes
 * @module callback Routes
 * @category routes
 * @subcategory callback
 */

import Controller from "../controllers"
import { validateToken } from "../utils/jwt.util";
import Validator from "../validators";

const { Callback: callback } = Controller;


const routes = async (route, options) => { // route = fastify instance
    /**
     * Route for callback of kyc.
     */
    route.post('/handler', {
        handler: callback.callbackHandler,
    });

     /**
     * Route for callback of offramp.
     */

    route.post('/offrampTransaction', {
        handler: callback.offrampCallbackRazorpay,
    });

      /**
     * Route for callback of onramp.
     */

    route.post('/onramp', {
        handler: callback.onrampCallback,
    });



};

export default routes;
