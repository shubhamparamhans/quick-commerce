import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    throw error;
  }
};

export const publishMessage = async (queue: string, message: object) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Message published to queue ${queue}`);
  } catch (error) {
    console.error('Failed to publish message', error);
    throw error;
  }
};

export const consumeMessage = async (queue: string, callback: (msg: amqp.ConsumeMessage | null) => void) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, callback, { noAck: false });
    console.log(`Consuming messages from queue ${queue}`);
  } catch (error) {
    console.error('Failed to consume message', error);
    throw error;
  }
};