var cron = require('node-cron');
var http = require('http');
var crypto = require('crypto');
var fs = require('fs');
var constants = require('constants');

var PRIVATE_KEY = "";
var URL_OPTIONS = {};

function init(){
  PRIVATE_KEY = fs.readFileSync('rsa_2048_priv.pem', 'utf8');
  URL_OPTIONS = JSON.parse(fs.readFileSync('cryptoMessageBox.json', 'utf8'));
}


cron.schedule('* * * * * *', function(){
  getEntries(decrypt);
});

function getEntries(callback){
    http.get(URL_OPTIONS, function(res) {
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

init();
getEntries(decrypt);
