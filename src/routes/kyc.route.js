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

const { Kyc: kyc } = Controller;
const { Kyc: validator } = Validator;

const routes = async (route, options) => {
  // route = fastify instance

  /**
   * Route for getting all supported networks
   * Handles getting all supported networks data
   */
  route.post("/Otp", {
    schema: validator.sendAadharOtp,
    // onRequest: [
    //   route.authenticate
    // ],
    preValidation: validateToken,
    handler:kyc.generateUserAadharOtp ,
  });

  
};

export default routes;
