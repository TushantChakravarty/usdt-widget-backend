import { CronJob } from "cron";
//updates
//import { logger } from "../../app";
import { getQuotes, getQuotesOfframp } from "../../ApiCalls/usdtapicalls";
//import queue from "../queue/index.js";
// import { getSettingByKey } from "../../services/site_setting.service.js";
// import { SETTINGS_CONSTANTS } from "../../constants/settings.constant.js"
// import { getCronSettingsTiming } from "../../services/cron_setting.service.js";
/**
 * Every 1 hour cron job
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every1HourCronJob = new CronJob("* * * * *", async () => {
    try {
        console.log("Hourly cron job starting for quotes");
        const body = {
            fromCurrency: "INR",
            toCurrency: "USDT",
            fromAmount: "1000",
            chain: "erc20",
            paymentMethodType: "UPI"
        };
        const bodyOfframp = 
            {
                "fromCurrency":"USDT",
                "toCurrency":"INR",
                "fromAmount":"10",
                "chain":"trc20"
            }
        
        await getQuotes(body); 
        await getQuotesOfframp(bodyOfframp)
         // Make sure to await asynchronous functions
        console.log("Hourly cron job end");
    } catch (err) {
        console.error(`HourlyCronJob error: ${err}`);  // Changed logger.error to console.error for simplicity
    }
}, null, true, "Asia/Kolkata");


// export all cron jobs
export default () => {
    Every1HourCronJob;
 
};
