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

const { Offramp: offramp } = Controller;
const { Offramp: validator } = Validator;

const routes = async (route, options) => { // route = fastify instance

  /**
 * Route for getting all supported networks
 * Handles getting all supported networks data
 */
  route.post('/createTransaction', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    schema: validator.createOfframp,
    preValidation: validateToken,
    handler: offramp.offRampRequest,
  });


  /**
 * Route for getting all supported networks
 * Handles getting all supported networks data
 */
  route.post('/addFiatAccount', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    schema: validator.addFiatAccount,
    preValidation: validateToken,
    handler: offramp.AddFiatAccountId,
  });


  /**
 * Route for getting all supported networks
 * Handles getting all supported networks data
 */
  route.get('/getAllFiatAccount', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    preValidation: validateToken,
    handler: offramp.getAllFiatAccount,
  });

  /**
* Route for getting quote for offramp 
* Handles getting quotes for a given coin-currency pair
*/
  route.post('/getQuotes', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    schema: validator.getQuotesOfframp,
    preValidation: validateToken,
    handler: offramp.getQuotes,
  });

  /**
* Route for getting all offramp transactions
* Handles getting all offramp transactions
*/
  route.get('/getAllTransactions', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    // schema: validator.getQuotesOfframp,
    preValidation: validateToken,
    handler: offramp.getAllOffRamp,
  });


};



export default routes;
