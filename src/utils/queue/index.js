// /**
//  * Queue module
//  * @module Queue
//  * @category utils
//  * @subcategory queue
//  * @requires bullmq
//  * @see https://docs.bullmq.io/guide/queues
//  */

// import { Queue, Worker } from 'bullmq';
// import { processAfterUserSignup, processSkillScore } from "./user.queue.js";
// import { processCalculatePoint, processCalculateRank, processSettlement } from './contest.queue.js';
// import { processSaveAllMatches, processCompletedMatches, processSaveSquads, processSavePlaying11, processSaveFantasyPoints, processSaveScorecard } from './fantasy.queue.js';
// import { Redis } from 'ioredis';
// import { logger } from '../../app.js';
// import { procesSendNotificationToAll } from './notification.queue.js';

// const REDIS_URL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`

// const connection = new Redis(REDIS_URL);

// // Create a single queue
// const queue = new Queue('queue', { connection });

// // Create a worker to process jobs from the queue
// const worker = new Worker('queue', async (job) => {
//     switch (job.name) {
//         case 'user-signup':
//             await processAfterUserSignup(job);
//             break;
//         case 'user-skill-score':
//             await processSkillScore(job);
//             break;
//         // Add more cases here
//         case 'calculate-point':
//             await processCalculatePoint(job);
//             break;
//         case 'calculate-rank':
//             await processCalculateRank(job);
//             break;
//         case 'settlement':
//             await processSettlement(job);
//             break;
//         case 'save-all-scheduled-matches':
//             await processSaveAllMatches({ status: 1 });
//             break;
//         case 'save-all-cancelled-matches':
//             await processSaveAllMatches({ status: 4 });
//             break;
//         case 'save-all-live-matches':
//             await processSaveAllMatches({ status: 3 });
//             break;
//         case 'save-completed-matches':
//             await processCompletedMatches(job);
//             break;
//         case 'save-all-squads':
//             await processSaveSquads(job);
//             break;
//         case 'save-playing-11-squads':
//             await processSavePlaying11(job);
//             break;
//         case 'save-fantasy-points':
//             await processSaveFantasyPoints(job);
//             break;
//         case 'save-scorecard':
//             await processSaveScorecard(job);
//             break;
//         case 'send-notification':
//             await procesSendNotificationToAll(job)
//         default:
//             break;
//     }
// }, { connection });

// // Listen for errors
// queue.on('error', (error) => {
//     logger.error(`Queue error: ${error}`);
//     console.error(`Queue error: ${error}`);
// });

// // Listen for completed jobs
// queue.on('completed', (job) => {
//     logger.info(`Job completed with result ${job.returnvalue}`);
//     console.log(`Job completed with result ${job.returnvalue}`);
// });

// export default queue;