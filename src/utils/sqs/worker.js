import AWS from 'aws-sdk';
import { verifyTransaction } from '../../services/transaction.queue.service';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sqs = new AWS.SQS();
const MAX_RETRIES = 5; // Maximum retry attempts

async function processQueue(queueUrl, dlqUrl, callbackType) {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10, // Fetch up to 10 messages
    WaitTimeSeconds: 5, // Long polling
    VisibilityTimeout: 30,   
  };

  //console.log(`Worker ready to process messages for ${callbackType} queue.`);

  try {
    const data = await sqs.receiveMessage(params).promise();
    if (data.Messages) {
      for (const message of data.Messages) {
        const { details, callbackType, retries } = JSON.parse(message.Body);
        console.log(`Processing message from ${callbackType} queue.`);

        try {
          const verify_data = await verifyTransaction(details)


          // Delete the message after successful processing
          await sqs.deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          }).promise();
          console.log("Message processed and deleted:", message.MessageId);
        } catch (err) {
          console.error(`Error processing message from ${callbackType} queue:`, err);

          if (retries < MAX_RETRIES) {
            // Retry the message
            await sqs.sendMessage({
              QueueUrl: queueUrl,
              MessageBody: JSON.stringify({ details, callbackType, retries: retries + 1 }),
            }).promise();
            console.log(`Retrying message (${retries + 1}/${MAX_RETRIES}):`, message.MessageId);
          } else {
            // Move to DLQ after exceeding max retries
            await sqs.sendMessage({
              QueueUrl: dlqUrl,
              MessageBody: JSON.stringify({ details, callbackType }),
            }).promise();
            console.log(`Message moved to DLQ after ${MAX_RETRIES} retries:`, message.MessageId);
          }

          // Delete the original message from the queue
          await sqs.deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          }).promise();
        }
      }
    } else {
      console.log(`No messages to process in ${callbackType} queue.`);
    }
  } catch (error) {
    console.error(`Error receiving messages from ${callbackType} queue:`, error);
  }

  // Continuously poll for messages
  setTimeout(() => processQueue(queueUrl, dlqUrl, callbackType), 5000);
}

export function startProcessing() {
  const callbackQueues = [
    { queue: process.env.SQS_QUEUE_URL_VERIFY, dlq: process.env.SQS_DLQ_URL_VERIFY, type: "verifyTransaction" },

    // { queue: process.env.SQS_QUEUE_URL_PGBRO, dlq: process.env.SQS_DLQ_URL_PGBRO, type: "callbackPgbroPayin" },
    // Add more queues for other callback types
  ];

  callbackQueues.forEach(({ queue, dlq, type }) => {
    if (queue && dlq) {
      processQueue(queue, dlq, type);
    } else {
      console.error(`Queue or DLQ URL missing for ${type}.`);
    }
  });
}

// startProcessing();
