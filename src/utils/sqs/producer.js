import AWS from 'aws-sdk';


// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sqs = new AWS.SQS();

export async function enqueueCallback(details, callbackType) {
  const queueUrl = process.env.SQS_QUEUE_URL_VERIFY; // Get queue URL dynamically

  if (!queueUrl) {
    throw new Error(`Queue URL for callback type "${callbackType}" not configured.`);
  }

  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ details, callbackType, retries: 0 }), // Track retries
  };

  try {
    const result = await sqs.sendMessage(params).promise();
    console.log(`Callback enqueued to ${callbackType} queue:`, result.MessageId);
    return result;
  } catch (error) {
    console.error("Error enqueuing message to SQS:", error);
    throw error;
  }
}

