var udpAddress = "";
var udpPort = 0;
var lastUpdatedAt = -1;

const update = (address, port) => {
  udpAddress = address;
  udpPort = port;
  lastUpdatedAt = Date.now(); // Update the last updated timestamp
};

const get = () => {
  return { address: udpAddress, port: udpPort, lastUpdatedAt };
};

module.exports = {
  update,
  get,
};
