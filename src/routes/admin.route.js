/**
 * Router for callback-related endpoints.
 * @file callback Routes
 * @module callback Routes
 * @category routes
 * @subcategory callback
 */

import Controller from "../controllers";
import { validateAdminToken, validateToken } from "../utils/jwt.util";
import { validateRole } from "../utils/rbac";
import Validator from "../validators";

const { Admin: admin } = Controller;

const routes = async (route, options) => {
  // route = fastify instance
  /**
     * Route for admin register.
     * Handles the admin signup functionality.

     */
  route.post("/register", {
    schema: Validator.Admin.signup,
    preHandler: async (request, reply) => {
      request.body.emailId = request.body.emailId.trim();
      request.body.password = request.body.password.trim();
    },
    handler: admin.signup,
  });

  /**
   * Route for admin login.
   * Handles the admin signup functionality.
   */
  route.post("/login", {
    schema: Validator.Admin.signup,
    preHandler: async (request, reply) => {
      request.body.emailId = request.body.emailId.trim();
      request.body.password = request.body.password.trim();
    },
    handler: admin.login,
  });

  /**
   * Route for admin getUser.
   * Handles getting all users data.
   */
  route.get("/getUsers", {
    preValidation: [validateAdminToken, validateRole(["master_admin"])],
    handler: admin.getUsers,
  });

  /**
   * Route for admin get onramp transactions.
   * Handles getting all users onramp transaction data.
   */
  route.get("/getUsersOnrampTransactions", {
    preValidation: [validateAdminToken, validateRole(["master_admin"])],
    handler: admin.getUsersOnrampTransactions,
  });

  /**
   * Route for admin get offramp transactions.
   * Handles getting all users offramp transaction data.
   */
  route.get("/getUsersOfframpTransactions", {
    preValidation: [validateAdminToken, validateRole(["master_admin"])],
    handler: admin.getUsersOfframpTransactions,
  });

   /**
   * Route for admin get all users transactions.
   * Handles getting all users transaction data.
   */
   route.get("/getUsersTransactions", {
    preValidation: [validateAdminToken, validateRole(["master_admin"])],
    handler: admin.getUsersTransactions,
  });

  /**
   * Route for getting fees data.
   * Handles getting all fees data.
   */
  route.get("/getFees", {
    preValidation: [validateAdminToken, validateRole(["master_admin"])],
    handler: admin.getFeesData,
  });


    /**
   * Route for getting fees data.
   * Handles getting all fees data.
   */
    route.get("/getRates", {
      preValidation: [validateAdminToken, validateRole(["master_admin"])],
      handler: admin.getRatesData,
    });
  

  /**
   * Route for getting fees data.
   * Handles getting all fees data.
   */
  route.post("/updateFees", {
    schema: Validator.Admin.updateFeeSchema,
    preValidation: [validateAdminToken, validateRole(["master_admin"])],
    handler: admin.updateFeesAndRatesData,
  });
};

export default routes;
