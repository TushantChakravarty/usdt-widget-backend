/**
 * Router for user-related endpoints.
 * Handles user authentication, user management, and access control operations.
 * @file user Routes
 * @module user Routes
 * @category routes
 * @subcategory user
 */

import Controller from "../controllers";
import { validateToken } from "../utils/jwt.util";
import Validator from "../validators";

const { CallbackAfrica: callback } = Controller;
const { Kyc: validator } = Validator;

const routes = async (route, options) => {
  // route = fastify instance

  /**
   * Route for getting kyc otp
   * Handles getting kyc otp
   */
  route.post("/", {
    handler:callback.callbackHandler ,
  });
  
};

export default routes;
