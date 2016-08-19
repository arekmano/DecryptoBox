var cron = require('node-cron');
var http = require('http');
var crypto = require('crypto');
var fs = require('fs');
var constants = require('constants');

var PRIVATE_KEY = "";



fs.readFile('rsa_2048_priv.pem', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  PRIVATE_KEY = data;
});

cron.schedule('* * * * * *', function(){
  
});

function getEntries(callback){
    http.get({
    hostname: 'localhost',
    port: 3000,
    path: '/read',
    agent: false
  }, function(res) {
    res.on('data', function(chunk) {
      callback(JSON.parse(chunk.toString())[0]);
    });
  });
}

function decrypt(pair){
  decrypted_pair = {
    key: crypto.privateDecrypt( {key: PRIVATE_KEY, padding: constants.RSA_PKCS1_PADDING}, new Buffer(pair.key, 'base64')).toString(),
    value: crypto.privateDecrypt( {key: PRIVATE_KEY, padding: constants.RSA_PKCS1_PADDING}, new Buffer(pair.value, 'base64')).toString()
  };
  console.log(decrypted_pair);
  return decrypted_pair;
}

getEntries(decrypt);
