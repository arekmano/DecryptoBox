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
  getEntries(decrypt, removeEntries);
});

function getEntries(decrypt_callback, remove_callback){
  var get_options = {
    hostname : URL_OPTIONS.hostname,
    port : URL_OPTIONS.port,
    agent : URL_OPTIONS.agent,
    path: URL_OPTIONS.path
  }
    http.get(get_options, function(res) {
    res.on('data', function(chunk) {
      var response_json = JSON.parse(chunk.toString());
      if (response_json.length == 0){
        console.log(new Date() + ': Found No entries');
      } else {
        console.log(new Date() + ': Found ' + response_json.length + ' pair(s)');
        remove_callback();
      }
      response_json.forEach(function(element){
        decrypt_callback(element);
      })
    });
  });
}

function removeEntries(){
  var delete_options = {
    hostname : URL_OPTIONS.hostname,
    port : URL_OPTIONS.port,
    agent : URL_OPTIONS.agent,
    method: 'DELETE',
    path: URL_OPTIONS.path
  }
  var req = http.request(delete_options, function(res) {
    res.on('data', function(chunk) {
      console.log(new Date() + ': Cleared Messages.')
    });
  });
  req.end();
}


function decrypt(pair){
  decrypted_pair = {
    key: crypto.privateDecrypt( {key: PRIVATE_KEY, padding: constants.RSA_PKCS1_PADDING}, new Buffer(pair.key, 'base64')).toString(),
    value: crypto.privateDecrypt( {key: PRIVATE_KEY, padding: constants.RSA_PKCS1_PADDING}, new Buffer(pair.value, 'base64')).toString()
  };
  console.log(new Date() + ': Decrypted Key/Value');
  console.log(decrypted_pair);
  return decrypted_pair;
}

init();
getEntries(decrypt);
