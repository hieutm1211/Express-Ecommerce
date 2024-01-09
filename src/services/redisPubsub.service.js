const Redis = require('redis');

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();
  }

  publish(channel, message) {
    console.log('publish', channel, message);
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, callback) {
    console.log('subscribe', channel, callback);
    // Check if the subscriber client is connected
    this.subscriber.subscribe(channel);
    console.log('subscribed', channel);
    this.subscriber.on('message', (subscribeChannel, message) => {
      console.log('hello', subscribeChannel);
      if (channel === subscribeChannel) {
        callback(channel, message);
      }
    });

    // Handle errors on the subscriber client
    this.subscriber.on('error', (err) => {
      console.error('Subscriber client error:', err);
    });

    // Handle the 'end' event (client closed)
    this.subscriber.on('end', () => {
      console.error('Subscriber client closed');
      // You might want to handle this case, e.g., attempt to reconnect.
    });
  }
}

module.exports = new RedisPubSubService();
