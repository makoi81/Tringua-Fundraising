// var Sequelize = require('sequelize');
// var sequelize = new Sequelize(databaseURL);
// var databaseURL = 'sqlite://db';

var http = require('http');
var twilio = require('twilio');
var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require("body-parser");

var listSms = [];

var users = [
	{
		username: "KOITA",
		phoneNumber: "+16467658666"
		//14696450110
	}
];
var twilioNumber = "14696450110";

var loggedInUser = users[0];

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));

// set of views engine for handlebars ejs for ejs
app.set('view engine', 'ejs')

// set the route for the home page
app.get('/', function(req, res){
	console.log("hi this list rendering ");
	
	 res.render('login', {listMessages: listSms});
	//redirect("/");
});

app.post('/login', function(req, res){  
 res.render('index', {listMessages: listSms});
});



// set the route for the home page
app.get('/sms', function(req, res){
	console.log("hi this list rendering ");
	
	// res.render('index', {listMessages: listSms});
	redirect("/");

});



// create   route for  sms
app.post('/sms', function(req, res){

	var phoneNumbers = users.map(user => "+"+user.phoneNumber);
	var d = new Date();
	var newSms = {
		//'receiver': phoneNumbers.join(","),
		//'receiver':"+16467658666",
		'receiver':loggedInUser.phoneNumber,

		// 'sender':loggedInUser.phoneNumber,
		'sender': twilioNumber ,
		'message': req.body.message,
		'dateTime': d
	}

	listSms.push(newSms);
	console.log(listSms);
	console.log('Hi guys this my express app');
    //var accountSid =node.env.accountSid;
	var accountSid ='AC52dd23a570e46e5d3799d53bfce4894b'; 
	var authToken ='8bfb4ca1d81077737fcb6b207e222956'; 
	// Send the text message.
	var client = twilio(accountSid, authToken);
    // var twiloNumber = 14696450110;
	//  var from = demo ? twiloNumber : newSms.sender;
	//  if (demo) {

	// }

	
	client.sendMessage({

	  to:newSms.receiver,
	  from: twilioNumber,
	  body: req.body.message
	  
	}, function(err, data){
		if(err) {
			console.log(err);
			res.status(500).send("Error!");
		} else {
			console.log(data);

		}
	});	
	res.redirect('/');

});
http.createServer(app).listen(port, function () {
   console.log("Express server listening on port "+ port);
  
});

