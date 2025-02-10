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

const { OfframpAfrica: offramp } = Controller;

const routes = async (route, options) => {
  // route = fastify instance

  /**
   * Route for getting all supported countries in africa
   * Handles getting all d countries in africa
   */
  route.get("/getChannels", {
    // onRequest: [
    //   route.authenticate
    // ],
   // preValidation: validateToken,
    handler:offramp.getChannels ,
  });



  
};

export default routes;
