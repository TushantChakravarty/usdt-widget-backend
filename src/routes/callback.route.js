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
    route.post('/callback', {
        handler: callback.CallbackHandler,
    });


};

export default routes;
