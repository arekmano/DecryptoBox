var fs = require('fs');
var process = require('process');
module.exports = {
  PRIVATE_KEY: fs.readFileSync('rsa_2048_priv.pem', 'utf8'),
  URL_OPTIONS: {
    hostname: process.env.CRYPTOHOST,
    port: 443,
    agent: false
  },
  PROCESS_OPTIONS: {
    hostname: process.env.DECRYPTHOST,
    agent: false
  }
};
