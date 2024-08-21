import amqp from "amqplib"


export async function consumeRabbitMQMessages() {
    try {
        console.log("->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'push_notifications';

        await channel.assertQueue(queue, { durable: true });

        channel.consume(queue, (msg) => {
            console.log("this is message", msg)
            if (msg !== null) {
                const message = msg.content.toString('utf-8')
                console.log(`Processing message for user: ${message}`);

                // Simulate message processing
                setTimeout(() => {
                    channel.ack(msg);
                }, 100); // Processing delay
            }
        }, { noAck: false });

    } catch (error) {
        console.log("**********************************************************************************************************")
        console.error('Error in RabbitMQ consumer:', error);
    }
}