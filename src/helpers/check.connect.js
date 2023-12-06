const os = require('os');
const process = require('process');
const { default: mongoose } = require("mongoose")
const _SECOND = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);
}

const checkOverload = () => {
  setInterval( () => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    //Example: Max connections based on number of cores
    const maxConnections = numCore * 5;
    
    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if(numConnection > maxConnections){
      console.log('Connection overload detected');
    }
  }, _SECOND); 
}


module.exports = {
  countConnect,
  checkOverload
}