/** Entrypoint for validators that registers all validators in the folder and exports Validator object. 
 * @module Validator
 * @category validators
 * @subcategory validator
 */
import * as User from "./user/user.validator.js"
import * as Offramp from "./user/offramp.validator.js"
import * as Admin from "./admin/admin.validator.js"
import * as Kyc from "./user/kyc.validator.js"

const Validator = {
    User, Offramp, Admin, Kyc
};

export default Validator;