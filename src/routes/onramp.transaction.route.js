/**
 * Router for user-related endpoints.
 * Handles user authentication, user management, and access control operations.
 * @file user Routes
 * @module user Routes
 * @category routes
 * @subcategory user
 */

import Controller from "../controllers"
import { validateToken } from "../utils/jwt.util";
import Validator from "../validators";

const { Onramp: onramp } = Controller;
const { User: validator } = Validator;

const routes = async (route, options) => { // route = fastify instance

    /**
   * Route for getting all supported networks
   * Handles getting all supported networks data
   */
    route.get('/transaction', {
        //schema: validator.updatePhone,
        // onRequest: [
        //   route.authenticate
        // ],
        preValidation: validateToken,
        handler: onramp.getAllOnRampTransaction,
    });


};



export default routes;
