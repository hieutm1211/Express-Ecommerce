const amqp = require('amqplib');

// const log = console.log;
// console.log = function() {
//   log.apply(console, [new Date()].concat(arguments));
// }

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost');
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx'; // direct
    const notificationQueue = 'notificationQueue'; // assertQueue
    const notificationExchangeDLX = 'notificationExchangeDLX'; // direct
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assert
    
    //1. create Exchange 
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    //2. create Queue
    const queueResult = await channel.assertQueue( notificationQueue, {
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    });

    //3. Bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    //4.send Message
    const msg = 'a new product';
    console.log(`producer msg::`, msg);
    console.log('queue result', queueResult.queue);
    await channel.sendToQueue( queueResult.queue, Buffer.from(msg), {
      expiration: '10000'
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

runProducer().catch(console.error);