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

const { OnRampAfrica: onramp } = Controller;

const routes = async (route, options) => {
 

  

  route.post("/createOnrampPayment", {
    // onRequest: [
    //   route.authenticate
    // ],
   // preValidation: validateToken,
    handler:onramp.createOnrampPayment ,
  });

  
};

export default routes;
