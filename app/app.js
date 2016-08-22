var http = require('http');
var crypto = require('crypto');
var constants = require('constants');
var Processor = require('./processor');
var Settings = require('./settings');

function getEntries(){
  var get_options = {
    hostname : Settings.URL_OPTIONS.hostname,
    port : Settings.URL_OPTIONS.port,
    agent : Settings.URL_OPTIONS.agent,
    path: Settings.URL_OPTIONS.path
  };
    http.get(get_options, function(res) {
    res.on('data', function(chunk) {
      var response_json = JSON.parse(chunk.toString());
      if (response_json.length === 0){
        console.log(new Date() + ': Found No entries');
      } else {
        console.log(new Date() + ': Found ' + response_json.length + ' pair(s)');
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
    path: Settings.URL_OPTIONS.path
  };
  var req = http.request(delete_options, function(res) {
    res.on('data', function(chunk) {
      console.log(new Date() + ': Cleared Messages.');
    });
  });
  req.end();
}

function decrypt(pair){
  decrypted_pair = {
    key: crypto.privateDecrypt( {key: Settings.PRIVATE_KEY, padding: constants.RSA_PKCS1_PADDING}, new Buffer(pair.key, 'base64')).toString(),
    value: crypto.privateDecrypt( {key: Settings.PRIVATE_KEY, padding: constants.RSA_PKCS1_PADDING}, new Buffer(pair.value, 'base64')).toString()
  };
  console.log(new Date() + ': Decrypted Key/Value');
  console.log(decrypted_pair);
  return decrypted_pair;
}

module.exports = {
  getEntries : getEntries,
  removeEntries : removeEntries,
  decrypt : decrypt
};
