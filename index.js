require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dgram = require("dgram");
const package = require("./package.json"); // Import package.json for version info

const wakeUpService = require("./services/wakeup.services"); // Import the wakeup service function
const encryption = require("./services/encryption.services");
const path = require("path");
const { start: startUdp } = require("./servers/udp.server");
const { receiveUdpPing } = require("./services/udp.services");

const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({
    message: "An internal server error occurred",
    success: false,
  });
});

// Express server routes
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.set("Content-Security-Policy", "script-src 'self' 'nonce-abc123'");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/stats", (req, res) => {
  res.send(
    `Wake On LAN UDP Forwarder Server ${
      package.version
    } is running ${Date.now()}`
  );
});

app.post("/wake-up-call", (req, res) => {
  const { password } = req.body; // Extract message from request body
  if (!password) {
    return res.status(400).json({
      message: "Message is required",
      success: false,
    });
  }

  const result = wakeUpService.handleWakeUpCall(password); // Call the wake up service function

  res.json(result);
});

app.post("/encrypt", (req, res) => {
  const { message } = req.body; // Extract message from request body

  res.json({
    message: encryption.encrypt(message), // Encrypt the message using the encryption service
    success: true,
  });
});

app.post("/decrypt", (req, res) => {
  const { message } = req.body; // Extract message from request body

  res.json({
    message: encryption.decrypt(message), // Encrypt the message using the encryption service
    success: true,
  });
});

app.post("/hash", (req, res) => {
  const { message } = req.body; // Extract message from request body

  res.json({
    message: encryption.hash(message), // Encrypt the message using the encryption service
    success: true,
  });
});

// Start Express server
const PORT = parseInt(process.env.HTTP_PORT, 10) || 5000;
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});

startUdp(receiveUdpPing); // Start the UDP server
