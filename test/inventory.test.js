const redisPubsubService = require("../src/services/redisPubsub.service");

class InventoryServiceTest {
  constructor() {
    console.log('subscribing to inventory');
    redisPubsubService.subscribe('purchase_events', (channel, message) => {
      console.log('hello', message);
      InventoryServiceTest.updateInventory(JSON.parse(message));
    })
  }

  static updateInventory(message) {
    console.log(`Update inventory ${message.productId} with quantity ${message.quantity}`);
  }
}

module.exports = new InventoryServiceTest();