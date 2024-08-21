import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

export const connectKafka = async () => {
    await producer.connect();
    await consumer.connect();
};
