/**
 * Router for user-related endpoints.
 * Handles user authentication, user management, and access control operations.
 * @file user Routes
 * @module user Routes
 * @category routes
 * @subcategory user
 */

import Controller from "../controllers"
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
     route.post('/kyc/url', {
      //  schema: validator.signup,
        preHandler: async (request, reply) => {
            request.body.emailId = request.body.email_id.trim();
        },
        handler: user.getKycUrl,
    });




};

export default routes;
