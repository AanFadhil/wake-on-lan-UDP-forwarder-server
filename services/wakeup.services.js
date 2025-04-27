const encryption = require("./encryption.services");
const udpDataAccess = require("../data/udpAddress.data");
const dgram = require("dgram");

/**
 *
 * @param {String} message
 * @returns
 */
const handleWakeUpCall = (message) => {
  if (!message) return { message: "empty message", success: false };
  const hashedMessage = encryption.hash(message);

  if (hashedMessage !== process.env.WAKEUP_PASSWORD_HASH)
    return { message: "invalid password", success: false }; // Ignore if the message is not matching with stored hash key

  const rinfo = udpDataAccess.get();

  if (!rinfo.address || !rinfo.port)
    return { message: "no address or port", success: false }; // Ignore if the address or port is not set

  //forward wake up call in UDP to ESP32
  const udpServer = dgram.createSocket("udp4");

  const responseMessage = "wakey";

  console.log(`Sending wake-up call to ${rinfo.address}:${rinfo.port}`);
  udpServer.send(responseMessage, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error(`Error sending response: ${err}`);
    } else {
      console.log(`Response sent to ${rinfo.address}:${rinfo.port}`);
    }
    udpServer.close();
  });

  return {
    message: "ok",
    success: true,
    lastPingAt: new Date(rinfo.lastUpdatedAt).toISOString(),
  }; // Return true if the message is valid
};

module.exports = {
  handleWakeUpCall,
};
