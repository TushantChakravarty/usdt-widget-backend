/** Entrypoint for controllers that registers all controllers in the folder and exports Controller object. 
 * @module Controller
 * @category controllers
 * @subcategory controller
 */
import * as User from "./user.controller.js"
import * as Callback from "./callback.controller.js"

const Controller = {
    User, Callback
}

export default Controller