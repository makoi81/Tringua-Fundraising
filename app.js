var stripe = require('stripe')('process.env.secretStripeKey');
var path = require("path");
process.env.TWILIO_ACCOUNT_SID = 'YOUR_ACCOUNT_SID';
process.env.TWILIO_AUTH_TOKEN = 'YOUR_AUTH_TOKEN';

var Sequelize = require('sequelize');
//var databaseURL = 'sqlite://db';
var databaseURL = process.env.DATABASE_URL || 'sqlite://db';
console.log(databaseURL);

var sequelize = new Sequelize(databaseURL);
var moment = require('moment');
var http = require('http');
var twilio = require('twilio');
var express = require('express');
var app = express();
//var port = 3000;
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
//step for login
var session = require('express-session');
var passwordHash = require('password-hash');
var listSms = [];

//************ adding of sequelize*************

// var env = process.env.NODE_ENV || "development";
// var config = require(path.join(__dirname,'config', 'config.json'))[env];
// if (process.env.DATABASE_URL) {
//   var sequelize = new Sequelize(process.env.DATABASE_URL,config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
//************

var users = [
	{
		username: "KOITA",
		phoneNumber: "+16467658666"
	}
];
var twilioNumber = "14696450110";
var loggedInUser = users[0];

var Member = sequelize.define('Member', {
    phone:Sequelize.STRING,
    username: {
	    type: Sequelize.STRING,
	    allowNull: false,
	    unique: true
	},
    fullName:Sequelize.STRING,
    pswd:{
	    type: Sequelize.STRING,
	    allowNull: false,
	},
    pswd_repeat:Sequelize.STRING   
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
  secret: 'password-protected site',
  resave: false,
  saveUninitialized: true
}));
	// set of views engine for handlebars ejs for ejs
app.set('view engine', 'ejs')
	// set the route from login page to  the home page
app.get('/', function(req, res){
	console.log("hi this list rendering ");	
	res.render('login');
});
app.get('/Member.json', function(req, res){
	Member.findAll().then(function(){
		res.json(Member);
	});
});
app.get('/login', function(req, res){  
  res.render('index', {moment:moment, listMessages: listSms});
});
app.post('/login', function(req, res){  
  let username = req.body.username;
  let password = rea.body.password;
   
    Member.count({where:{username:username}}).then(function (count){
        if(!count == 0){
            User.findOne({
                where: {username:username}
            }).then(function(member){
                var pass = passwordHash.verify(req.body.password, member.password);
                if(pass){
                    req.session.MemberId = member.id;
                    req.session.username = member.username;                    
                    res.redirect('index')
                }else{
                    res.render('login');
                }            
            });
        }else{
            res.send('Wrong Email');
        }
    });
    console.log("login -----"+req.session.MemberId)
});
//------ logout
app.get('/logout', function(req, res) {
  req.session.MemberId = null;
  // res.redirect("/");
  res.redirect("login");	

});

// set the route from the home to the sign up page
app.get('/sign_up', function(req, res){
	console.log("hi this list rendering ");	
	
	Member.findAll().then(function(member){
			res.render('sign_up', {members: member});
	});
});
app.post('/sign_up', function(req, res){  
	var newMember = {	
		phone:req.body.phone,
		username:req.body.username,
		fullName:req.body.fullName,
		pswd:req.body.psw,
		pswd_repeat:req.body.psw_repeat		
	}
	sequelize.sync().then(function()
    {
    	return Member.create(newMember).then(function(member){
  		    req.session.MemberId = member.id;
  		    req.session.username =member.username;
  	    });
    });
     res.redirect('index');
});

// set the route for the home page
app.get('/sms', function(req, res){
	console.log("hi this list rendering ");	
	 res.render('index', {listMessages: listSms});
});

// create   route for  sms
app.post('/sms', function(req, res){
	var phoneNumbers = users.map(user => "+"+user.phoneNumber);
	  // var d = new Date();
	   var d=moment().format('LLLL');
	  // var d =moment("12-25-1995", "MM-DD-YYYY");
	var newSms = {
		'receiver':loggedInUser.phoneNumber,
		// 'sender':loggedInUser.phoneNumber,
		'sender': twilioNumber ,
		'message': req.body.message,
		'dateTime': d
	}
	listSms.push(newSms);
	console.log(listSms);
	console.log('Hi guys this my express app');
    
	// Send the text message.
	var client = twilio('YOUR_ACCOUNT_SID', 'YOUR_AUTH_TOKEN');
    // var twiloNumber = 14696450110;
	//  var from = demo ? twiloNumber : newSms.sender;
	//  if (demo) {
	// }	
	client.sendMessage({
	  to:newSms.receiver,
	  from: twilioNumber,
	  body: req.body.message	  
	}, 
	function(err, data){
		if(err) {
			console.log(err);
			// res.status(500).send("Error!");
		} else {
			console.log(data);
		}
	});	
	res.redirect('/login');
});

//password protect everything else
app.use(function(req, res, next) {
  if (req.session.MemberId) {
    next();
    return;
  }else{
  	res.redirect('/');
  }
});

//-------------------stripe-------------
app.get('/paysuccess', function(req, res){
  console.log("hi this list rendering "); 
   res.render("paysuccess", { }); 
});

app.post('/charge', function(req, res){
  console.log("hi this is the stripe api example "); 
  var token = req.body.stripeToken;
  var chargeAmount = req.body.chargeAmountt;
  var charge = stripe.charges.create({
    amount: chargeAmount,
    currency: 'usd',
    source: token
  }, function(err, charge){
      if(err & err.type === "stripeCardError"){
        console.log(" Your card was declined")
      }
    });
   res.redirect("/paysuccess");   
});
//----------------------end stripe---------------
http.createServer(app).listen(port, function () {
   console.log("Express server listening on port "+ port);  
});








