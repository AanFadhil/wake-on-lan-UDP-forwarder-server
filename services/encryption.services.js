const crypto = require("crypto");

const algorithm = "aes-256-cbc"; // Encryption algorithm
const iv = Buffer.from(process.env.IV, "base64"); // Initialization vector
const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64"); // Encryption key

const decrypt = (text) => {
  const encryptedText = Buffer.from(text, "base64"); // Encrypted text

  const decipher = crypto.createDecipheriv(algorithm, key, iv); // Create decipher object

  let decrypted = decipher.update(encryptedText); // Decrypt the text
  decrypted += decipher.final(); // Finalize decryption

  return decrypted.toString("utf-8"); // Return the decrypted text
};

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv); // Create cipher object

  let encrypted = cipher.update(text); // Encrypt the text
  encrypted += cipher.final("base64"); // Finalize encryption

  return encrypted.toString("base64"); // Return the encrypted text in base64 format
};

const hash = (text) => {
  const hash = crypto.createHash("sha256"); // Create SHA-256 hash object
  hash.update(text); // Update the hash with the text
  return hash.digest().toString("base64");
};

module.exports = {
  decrypt,
  hash,
  encrypt,
};
