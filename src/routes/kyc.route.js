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
   * Route for getting kyc otp
   * Handles getting kyc otp
   */
  route.post("/otp", {
    schema: validator.sendAadharOtp,
    // onRequest: [
    //   route.authenticate
    // ],
    preValidation: validateToken,
    handler:kyc.generateUserAadharOtp ,
  });
 /**
   * Route for verifying kyc otp
   * Handles verifying kyc otp
   */
  route.post("/verifyOtp", {
    schema: validator.verifyAadharOtp,
    // onRequest: [
    //   route.authenticate
    // ],
    preValidation: validateToken,
    handler:kyc.validateUserAadharOtp ,
  });

  
};

export default routes;
