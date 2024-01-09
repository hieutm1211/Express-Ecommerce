const amqp = require('amqplib');

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost');
    const channel = await connection.createChannel();
    const queueName = 'test-topic';

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue( queueName, Buffer.from('Hello world'));
    console.log('sent');
  } catch (error) {
    console.error(error);
  }
}

runProducer().catch(console.error);