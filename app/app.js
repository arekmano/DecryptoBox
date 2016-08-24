var https = require('https');
var crypto = require('crypto');
var constants = require('constants');
var Processor = require('./processor');
var Settings = require('./settings');
var winston = require('winston');

winston.add(winston.transports.File, { filename: 'info.log' });

function getEntries(){
  var get_options = {
    hostname : Settings.URL_OPTIONS.hostname,
    port : Settings.URL_OPTIONS.port,
    agent : Settings.URL_OPTIONS.agent,
    path: '/read'
  };
    https.get(get_options, function(res) {
    res.on('data', function(chunk) {
      var response_json = JSON.parse(chunk.toString());
      if (response_json.length === 0){
        winston.info(new Date() + ': Found no pairs in crypto message box');
      } else {
        winston.info(new Date() + ': Found ' + response_json.length + ' pair(s)');
        removeEntries();
      }
      response_json.forEach(function(element){
        decrypted_pair = decrypt(element);
        Processor.process(decrypted_pair);
      });
    });
  });
}

function removeEntries(){
  var delete_options = {
    hostname : Settings.URL_OPTIONS.hostname,
    port : Settings.URL_OPTIONS.port,
    agent : Settings.URL_OPTIONS.agent,
    method: 'DELETE',
    path: '/read'
  };
  var req = https.request(delete_options, function(res) {
    res.on('data', function(chunk) {
      winston.info(new Date() + ': Cleared Stored Pairs');
    });
  });
  req.end();
}

function decrypt(pair){
  winston.info(pair)
  decrypted_pair = {
    key: crypto.privateDecrypt( {key: Settings.PRIVATE_KEY, padding: constants.RSA_PKCS1_PADDING}, new Buffer(pair.key, 'base64')).toString(),
    value: crypto.privateDecrypt( {key: Settings.PRIVATE_KEY, padding: constants.RSA_PKCS1_PADDING}, new Buffer(pair.value, 'base64')).toString()
  };
  winston.info(decrypted_pair);
  return decrypted_pair;
}

module.exports = {
  getEntries : getEntries,
  removeEntries : removeEntries,
  decrypt : decrypt
};
