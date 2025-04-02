import { CronJob } from "cron";
//updates
//import { logger } from "../../app";
import { getQuotes, getQuotesOfframp } from "../../ApiCalls/usdtapicalls";
import db from "../../models/index.js"
import { Op } from "sequelize";

const { User, OnRampTransaction, OffRampTransaction, Payout, Payin, OffRampLiveTransactions, WalletPoolModel } = db;

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
const Every1HourCronJob = new CronJob("0 * * * *", async () => {
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

const FifteenMinuteCleanupJob = new CronJob("*/1 * * * *", async () => {
    try {
      const cutoffTime = new Date(Date.now() - 10 * 60 * 1000); // 15 mins ago
  
      // Step 1: Find the PENDING transactions to be cleaned
      const staleTransactions = await OffRampLiveTransactions.findAll({
        where: {
          status: "PENDING",
          date: {
            [Op.lt]: cutoffTime,
          },
        },
      });
  
      if (staleTransactions.length === 0) {
        return console.log("✅ No stale PENDING transactions found.");
      }
  
      // Step 2: Loop through each stale tx, release wallet if depositAddress exists
      for (const tx of staleTransactions) {
        if (tx.depositAddress) {
          await WalletPoolModel.update(
            {
              inUse: false,
              assignedToUserId: null,
              lastAssignedAt: null,
            },
            {
              where: {
                address: tx.depositAddress,
              },
            }
          );
          console.log(`🔄 Released wallet: ${tx.depositAddress}`);
        }
      }
  
      // Step 3: Delete all stale transactions
      const txIds = staleTransactions.map((t) => t.id);
      const deletedCount = await OffRampLiveTransactions.destroy({
        where: { id: { [Op.in]: txIds } },
      });
  
      console.log(`🗑️ Deleted ${deletedCount} old PENDING transactions.`);
  
    } catch (err) {
      console.error("❌ FifteenMinuteCleanupJob error:", err);
    }
  }, null, true, "Asia/Kolkata");
  


// export all cron jobs
export default () => {
  //  Every1HourCronJob;
    FifteenMinuteCleanupJob;
};
