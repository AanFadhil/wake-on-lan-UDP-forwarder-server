const dgram = require("dgram");
const { receiveUdpPing } = require("../services/udp.services");

const udpServer = dgram.createSocket("udp4");
const udpServerEcho = dgram.createSocket("udp4");

const start = () => {
  // UDP server setup
  udpServer.on("message", receiveUdpPing);

  udpServer.on("error", (err) => {
    console.error(`UDP server error:\n${err.stack}`);
  });

  udpServer.on("listening", () => {
    const address = udpServer.address();
    console.log(
      `UDP server is listening on ${address.address}:${address.port}`
    );
  });

  // Start UDP server
  const UDP_PORT = parseInt(process.env.UDP_PORT, 10) || 5001;
  udpServer.bind(UDP_PORT, process.env.LOCAL_ADDRESS);

  const ECHO_PORT = parseInt(process.env.UDP_ECHO_PORT, 10) || 5002;
  udpServerEcho.on("message", (msg, rinfo) => {
    console.log(`UDP echo ${rinfo.address}:${rinfo.port} => ${msg}`);
    console.log(
      `UDP echo hex ${rinfo.address}:${rinfo.port} ${msg.length} / ${
        msg.byteLength
      }
    } => ${msg.toString("hex")}`
    );
  });

  if (process.env.ENABLE_ECHO === "true") {
    udpServerEcho.bind(ECHO_PORT, process.env.UDP_ECHO_ADDRESS);
    udpServerEcho.on("listening", () => {
      const address = udpServerEcho.address();
      console.log(
        `UDP ECHO server is listening on ${address.address}:${address.port}`
      );
    });
  }
};

const getUdpServer = () => {
  return udpServer;
};

module.exports = {
  start,
  getUdpServer,
};
