// import { CronJob } from "cron";
// //updates
// import { logger } from "../../app";
// import queue from "../queue/index.js";
// // import { getSettingByKey } from "../../services/site_setting.service.js";
// // import { SETTINGS_CONSTANTS } from "../../constants/settings.constant.js"
// // import { getCronSettingsTiming } from "../../services/cron_setting.service.js";
// /**
//  * Every 30 seconds cron job
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every30SecondsCronJob = new CronJob("*/30 * * * * *", async () => {
//     try {
//         console.log("Every 30 sec cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-SEC")
//             console.log("this is cron settings", cron_setting)
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 30 sec cron job end")
//     } catch (err) {
//         logger.error(`Every30SecondsCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata");

// /**
//  * Every 1 min cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every1MinCronJob = new CronJob("0 */1 * * * *", async () => {
//     try {
//         console.log("Every 1 min cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("1-MIN")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 1 min cron job end")
//     } catch (err) {
//         logger.error(`Every1MinCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")
// /**
//  * Every 2 min cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every2MinCronJob = new CronJob("0 */2 * * * *", async () => {
//     try {
//         console.log("Every 2 min cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("2-MIN")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 2 min cron job starting")
//     } catch (err) {
//         logger.error(`Every1MinCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// /**
//  * Every 5 min cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every5MinCronJob = new CronJob("0 */5 * * * *", async () => {
//     try {
//         console.log("Every 5 min cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("5-MIN")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 5 min cron job end")
//     } catch (err) {
//         logger.error(`Every5MinCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")
// /**
//  * Every 10 min cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every10MinCronJob = new CronJob("0 */10 * * * *", async () => {
//     try {
//         console.log("Every 10 min cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("10-MIN")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 10 min cron job ending")
//     } catch (err) {
//         logger.error(`Every10MinCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// /**
//  * Every 15 min cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every15MinCronJob = new CronJob("0 */15 * * * *", async () => {
//     try {
//         console.log("Every 15 min cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("15-MIN")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 15 min cron job end")
//     } catch (err) {
//         logger.error(`Every10MinCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")
// /**
//  * Every 30 mins cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every30MinCronJob = new CronJob("0 */30 * * * *", async () => {
//     try {
//         // const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         // if (setting === "true") {
//         //     console.log("Starting every 30 mins cron jobs")
//         //     //call functions here
//         //     //scheduled
//         //     queue.add("save-all-scheduled-matches", {})
//         //     queue.add("save-all-squads", {})
//         //     console.log("Finished every 30 mins cron jobs")
//         // }

//         console.log("Every 30-min cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-MIN")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 30-min cron job end")
//     } catch (err) {
//         logger.error(`Every30MinCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// /**
//  * Every 1 hour cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every1HourCronJob = new CronJob("0 0 */1 * * *", async () => {
//     try {
//         console.log("Every one hour cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("1-HOUR")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every one hour cron job ending")
//     } catch (err) {
//         logger.error(`Every1HourCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// /**
//  * Every 3 hour cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every3HourCronJob = new CronJob("0 0 */3 * * *", async () => {
//     try {
//         console.log("Every 3 hour cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-SEC")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 3 hour cron job end")
//     } catch (err) {
//         logger.error(`Every3HourCronJob ${err}`)
//     }
// }, null, true, "Asia/Kolkata")


// /**
//  * Every 6 hour cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every6HourCronJob = new CronJob("0 0 */6 * * *", async () => {
//     try {
//         console.log("Every 6 hour cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-SEC")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 6 hour cron job end")
//     } catch (err) {
//         logger.error(`Every6HourCronJob ${err}`)
//     }
// }, null, true, "Asia/Kolkata")

// /**
//  * Every 12 hour cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every12HourCronJob = new CronJob("0 0 */12 * * *", async () => {
//     try {
//         console.log("Every 12 hours cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-SEC")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 12 hours cron job end")
//     } catch (err) {
//         logger.error(`Every12HourCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// /**
//  * Every 1 day cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every1DayCronJob = new CronJob("0 0 0 */1 * *", async () => {
//     try {
//         console.log("Every 1 Day cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-SEC")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 1 Day cron job end")
//     } catch (err) {
//         logger.error(`Every1DayCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// /**
//  * Every 1 week cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every1WeekCronJob = new CronJob("0 0 0 * * 0", async () => {
//     try {
//         console.log("Every 1 week cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-SEC")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every 1 week cron job end")
//     } catch (err) {
//         logger.error(`Every1WeekCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// /**
//  * Every 1 Month cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every1MonthCronJob = new CronJob("0 0 0 1 * *", async () => {
//     try {
//         console.log("Every one months cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-SEC")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every one months cron job end")
//     } catch (err) {
//         logger.error(`Every1MonthCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// /**
//  * Every 3 month cron jobs
//  * @param {Function} callback
//  * @returns {CronJob}
//  * @see {@link https://www.npmjs.com/package/cron}
//  */
// const Every3MonthCronJob = new CronJob("0 0 0 1 */3 *", async () => {
//     try {
//         console.log("Every three months cron job starting")
//         const setting = await getSettingByKey(SETTINGS_CONSTANTS.CRON_JOB.key)
//         if (setting === "true") {
//             const cron_setting = await getCronSettingsTiming("30-SEC")
//             for (let i = 0; i, cron_setting.length; i++) {
//                 queue.add(cron_setting[i].cron_key, {})
//             }
//         }
//         console.log("Every three months cron job end")
//     } catch (err) {
//         logger.error(`Every3MonthCronJob ${err}`)
//     }

// }, null, true, "Asia/Kolkata")

// // export all cron jobs
// export default () => {
//     Every30SecondsCronJob;
//     Every1MinCronJob;
//     Every2MinCronJob;
//     Every5MinCronJob;
//     Every10MinCronJob;
//     Every15MinCronJob;
//     Every30MinCronJob;
//     Every1HourCronJob;
//     Every3HourCronJob;
//     Every6HourCronJob;
//     Every12HourCronJob;
//     Every1DayCronJob;
//     Every1WeekCronJob;
//     Every1MonthCronJob;
//     Every3MonthCronJob;
// };
