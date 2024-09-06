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

const { User: user } = Controller;
const { User: validator } = Validator;

const routes = async (route, options) => { // route = fastify instance
  /**
   * Route for user login.
   * Handles the user login functionality.
   */
  route.post('/login', {
    schema: validator.login,
    preHandler: async (request, reply) => {
      request.body.emailId = request.body.emailId.trim();
      request.body.password = request.body.password.trim();
    },
    handler: user.login,
  });

  /**
   * Route for user signup.
   * Handles the user signup functionality.
   */
  route.post('/signup', {
    schema: validator.signup,
    preHandler: async (request, reply) => {
      request.body.emailId = request.body.emailId.trim();
      request.body.password = request.body.password.trim();
    },
    handler: user.signup,
  });


  /**
  * Route for user kyc.
  * Handles the user kyc.
  */
  route.get('/kyc/url', {
    //schema: validator.kycUrl,

    preValidation: validateToken,
    // preHandler: async (request, reply) => {
    //   const phoneNumber = request.body.phone_number.trim();
    //   request.body.phone_number = `+91-${phoneNumber}`;
    // },
    handler: user.getKycUrl,
  });

  /**
   * Route for user profile.
   * Handles the user profile
   */
  route.get('/profile', {
    //schema: validator.profile,
    // onRequest: [
    //   route.authenticate
    // ],
    preValidation: validateToken,

    //   preHandler: async (request, reply) => {
    //       request.body.email_id = request.body.email_id.trim();
    //   },
    handler: user.getProfile,
  });

  /**
* Route for adding  user phone number.
* Handles the user phone number update
*/
  route.post('/add/phone', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    preValidation: validateToken,
    handler: user.updatePhone,
  });

  /**
* Route for getting all crypto coins.
* Handles getting crypto coins data
*/
route.get('/getAllCoins', {
  //schema: validator.updatePhone,
  // onRequest: [
  //   route.authenticate
  // ],
  //preValidation: validateToken,
  handler: user.getAllCoins,
});

   /**
* Route for getting all supported currencies
* Handles getting all supported currencies data
*/
route.get('/getAllCurrencies', {
  //schema: validator.updatePhone,
  // onRequest: [
  //   route.authenticate
  // ],
 // preValidation: validateToken,
  handler: user.getAllCurrencies,
});

 /**
* Route for getting all supported networks
* Handles getting all supported networks data
*/
route.get('/getAllNetworks', {
  //schema: validator.updatePhone,
  // onRequest: [
  //   route.authenticate
  // ],
 // preValidation: validateToken,
  handler: user.getAllNetworks,
});


};



export default routes;
