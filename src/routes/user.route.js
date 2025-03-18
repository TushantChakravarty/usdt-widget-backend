/**
 * Router for user-related endpoints.
 * Handles user authentication, user management, and access control operations.
 * @file user Routes
 * @module user Routes
 * @category routes
 * @subcategory user
 */
// import Ajv from "ajv";
// import AjvErrors from "ajv-errors";

// // Initialize Ajv with allErrors enabled and custom error messages support
// const ajv = new Ajv({ allErrors: true });
// AjvErrors(ajv);
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
   * Route for user signup.
   * Handles the user signup functionality.
   */
  route.get('/signupOtp', {
    schema: validator.signupOtp,
    handler: user.sendSignUpOtp,
  });

  route.post('/sendAddPhoneOtp', {
    schema: validator.sendAddPhoneOtp,
    preValidation: validateToken,
    handler: user.sendAddPhoneOtp,
  });

  /**
   * Route for user signup.
   * Handles the user signup functionality.
   */
  route.get('/loginOtp', {
    schema: validator.loginOtp,
    handler: user.sendLoginOtp,
  });


  /**
   * Route for user signup.
   * Handles the user signup functionality.
   */
  route.get('/updateEmailOtp', {
    // schema: validator.loginOtp,
    preValidation: validateToken,
    handler: user.sendUpdateEmailOtp,
  });


  route.post('/updatePhoneOtp', {
    // schema: validator.sendAddPhoneOtp,
    preValidation: validateToken,
    handler: user.sendUpdatePhoneOtp,
  });

  route.get('/checkUser', {
    schema: validator.loginOtp,
    handler: user.checkUser,
  });

  route.get('/bankList', {
    // schema: validator.,
    preValidation: validateToken,
    handler: user.bankList,
  });

  route.post('/loginOtpV2', {
    schema: validator.loginOtpV2,
    handler: user.sendLoginOtpV2,
  });

    /**
   * Route for user signup.
   * Handles the user signup functionality.
   */
    route.get('/logout', {
      preValidation: validateToken,
      handler: user.logout,
    });
  
  

  /**
   * Route for user signup.
   * Handles the user signup functionality.
   */
  route.post('/changePassword', {
    preHandler: async (request, reply) => {
      request.body.oldPassword = request.body.oldPassword.trim();
      request.body.newPassword = request.body.newPassword.trim();
    },
    schema: validator.changePassword,
    preValidation: validateToken,
    handler: user.changePassword,
  });

  /**
   * Route for user signup.
   * Handles the user signup functionality.
   */
  route.get('/checkPhoneBank', {
    preValidation: validateToken,
    handler: user.checkMobileAndBankAddedOrNot,
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
   * Route for user profile.
   * Handles the user profile
   */
  route.get('/getCountryCodes', {
    //schema: validator.profile,
    // onRequest: [
    //   route.authenticate
    // ],
    preValidation: validateToken,

    //   preHandler: async (request, reply) => {
    //       request.body.email_id = request.body.email_id.trim();
    //   },
    handler: user.getCountryCodes,
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
* Route for adding  user phone number.
* Handles the user phone number update
*/
  route.post('/createOnrampTransaction', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    schema: validator.createOnramp,
    preValidation: validateToken,
    handler: user.onRampRequest,
  });

  /**
* Route for adding  user phone number.
* Handles the user phone number update
*/
  route.post('/get-quotes', {
    schema: validator.getQuotes,
    // onRequest: [
    //   route.authenticate
    // ],
    // preValidation: validateToken,
    handler: user.getQuotesNew,
  });
  /*
* Route for getting all crypto coins.
* Handles getting crypto coins data
*/
  route.get('/getAllCoins', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    //preValidation: validateToken,
    handler: user.getAllCoinsNew,
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
    handler: user.getAllNetworksNew,
  });

  /**
 * Route for getting usdtRate
 * Handles getting current usdt rate
 */
  route.get('/getUsdtRate', {
    //schema: validator.updatePhone,
    // onRequest: [
    //   route.authenticate
    // ],
    // preValidation: validateToken,
    handler: user.getUsdtRate,
  });


   /**
 * Route for getting usdtRate
 * Handles getting current usdt rate
 */
   route.get('/forgetOtp', {
    schema: validator.forgetPassword,
    // onRequest: [
    //   route.authenticate
    // ],
    // preValidation: validateToken,
    handler: user.sendForgetPasswordOtp,
  });

  /**
 * Route for getting usdtRate
 * Handles getting current usdt rate
 */
  route.post('/changeForgetPassword', {
    schema: validator.changeForgetPassword,
    // onRequest: [
    //   route.authenticate
    // ],
    // preValidation: validateToken,
    handler: user.changeForgetPassword,
    // validatorCompiler: ({ schema }) => ajv.compile(schema),
    // schemaErrorFormatter: (errors) => new Error(errors[0].message),
  });

  route.get('/delete', {
    // onRequest: [
    //   route.authenticate
    // ],
    preValidation: validateToken,
    handler: user.deleteUser,
    // validatorCompiler: ({ schema }) => ajv.compile(schema),
    // schemaErrorFormatter: (errors) => new Error(errors[0].message),
  });

  route.post('/updateProfile', {
    preValidation: validateToken,
    handler: user.updateProfile,
  });

  route.post('/verifyUpdateOtp', {
    preValidation: validateToken,
    handler: user.updateOtp,
  });

};



export default routes;
