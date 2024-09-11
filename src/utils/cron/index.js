import { CronJob } from "cron";
//updates
//import { logger } from "../../app";
import { getQuotes } from "../../ApiCalls/usdtapicalls";
//import queue from "../queue/index.js";
// import { getSettingByKey } from "../../services/site_setting.service.js";
// import { SETTINGS_CONSTANTS } from "../../constants/settings.constant.js"
// import { getCronSettingsTiming } from "../../services/cron_setting.service.js";
/**
 * Every 30 seconds cron job
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every30SecondsCronJob = new CronJob("*/30 * * * * *", async () => {
    try {
        console.log("Every 30 sec cron job starting for quotes")
        const body = {
            fromCurrency:"INR",
            toCurrency:"USDT",
            fromAmount:"1000",
            chain:"erc20",
            paymentMethodType:"UPI"
        }
        getQuotes(body)
        console.log("Every 30 sec cron job end")
    } catch (err) {
        //logger.error(`Every30SecondsCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata");


// export all cron jobs
export default () => {
    Every30SecondsCronJob;
 
};
