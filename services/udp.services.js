const udpDataAccess = require("../data/udpAddress.data");
const dgram = require("dgram");
const encryption = require("./encryption.services");
const { getUdpServer } = require("../servers/udp.server");

/**
 *
 * @param {String} message
 * @param {dgram.RemoteInfo} rinfo
 */
const receiveUdpPing = (message, rinfo) => {
  console.log(
    `UDP message received: ${message} from ${rinfo.address}:${rinfo.port}`
  );

  // Update the UDP address and port in the data access layer
  try {
    const decryptedMessage = message.toString(); //encryption.decrypt(message); // Decrypt the message
    //console.log(`Decrypted message: ${decryptedMessage}`);

    if (!decryptedMessage) return;

    if (!decryptedMessage.startsWith("ping_")) return; // Ignore if the message is not "ping"

    udpDataAccess.update(rinfo.address, rinfo.port); // Update the UDP address and port in the data access layer

    const responseMessage = Buffer.from("pong");
    const udpServer = getUdpServer(); // Get the UDP server instance
    udpServer.send(responseMessage, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error(`Error sending response: ${err}`);
      } else {
        console.log(`Response sent to ${rinfo.address}:${rinfo.port}`);
      }
      udpServer.close();
    });
  } catch (error) {
    console.error(`Error processing UDP message: ${error.message}`);
  }
};

module.exports = {
  receiveUdpPing,
};
