var fs = require('fs');
module.exports = {
  PRIVATE_KEY: fs.readFileSync('rsa_2048_priv.pem', 'utf8'),
  URL_OPTIONS: {
    hostname: "localhost",
    port: 3000,
    agent: false,
    path: "/read"
  }
};
