/** Entrypoint for validators that registers all validators in the folder and exports Validator object. 
 * @module Validator
 * @category validators
 * @subcategory validator
 */
import * as User from "./user/user.validator.js"
const Validator = {
    User
};

export default Validator;