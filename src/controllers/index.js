/** Entrypoint for controllers that registers all controllers in the folder and exports Controller object. 
 * @module Controller
 * @category controllers
 * @subcategory controller
 */
import * as User from "./user.controller.js"
import * as Callback from "./callback.controller.js"
import * as Onramp from "./onramp.controller.js"
import * as Offramp from "./offramp.controller.js"
import * as Admin from "./admin.controller.js"
import * as Kyc from "./kyc.controller.js"
import * as OfframpAfrica from "./offramp.africa.controller.js"
import * as OnRampAfrica from "./onramp.africa.controller.js"


const Controller = {
    User, Callback, Onramp, Offramp,Admin,Kyc,OfframpAfrica,OnRampAfrica
}

export default Controller