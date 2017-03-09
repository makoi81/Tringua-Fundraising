// Twilio Credentials 
var accountSid = 'AC52dd23a570e46e5d3799d53bfce4894b'; 
var authToken = '8bfb4ca1d81077737fcb6b207e222956'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
client.messages.create({ 
    to: "+16467658666", 
    from: "+14696450110", 
    body: "Hi guys I text from Twilio", 
}, function(err, message) { 
    console.log(message.sid); 
});