var cron = require('node-cron');
var app = require('./app/app');

cron.schedule('* * * * * *', function(){
  app.getEntries();
});
