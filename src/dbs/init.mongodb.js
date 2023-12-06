'use strict';

const { default: mongoose } = require("mongoose");
const connectionString = 'mongodb://127.0.0.1:27017/shopDEV';

class Database {
  
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    if(1 === 1){
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose.connect( connectionString).then( _ => console.log('Connected Mongodb Success'))
      .catch( err => console.log('Error connect', err));
  }

  static getInstance() {
    if(!Database.instance){
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;