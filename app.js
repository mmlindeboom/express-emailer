
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , thanks = require('./routes/thankyou')
  , http = require('http')
  , path = require('path')
  , compass = require('compass')
  , nodemailer = require('nodemailer')
  , expressValidator = require('express-validator');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', routes.index);
app.get('/thankyou', thanks.page);



// Handle Posta data
app.post('/', function(request, response){
    var name = request.body.user.name;
    var email = request.body.user.email;
    var needs = request.body.user.needs;
    var toemail = request.body.toemail;

    request.assert('toemail', 'A valid To email address required').isEmail();
    request.assert('user.name', 'Name is required').notEmpty();
    request.assert('user.email', 'A valid email is required').isEmail();
    request.assert('user.needs', 'The needs field is required').notEmpty();

    var errors = request.validationErrors();

    if( !errors) {
      var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
           auth: {
               user: "YOUR GMAIL HERE", //example: your.email@gmail.com
               pass: "YOUR GMAIL PASS HERE"
           }
        });
      smtpTransport.sendMail({
           from: name + '<'+email+'>', // sender address
           to: 'Test Email' + '<'+ toemail +'>', // comma separated list of receivers
           subject: "An email from node! ✔", // Subject line
           text: 'Name: ' + name  + '\nEmail: ' + email + '\nNeeds: '+ needs, // plaintext body
           html: '<p><strong>Name:</strong> ' + name + '</p><p><strong>Email:</strong> '+ email +
                  '</p><p><strong>Needs:</strong> '+ needs + '</p>'
        }, function(error, response){
           if(error){
               console.log(error);
           }else{
               console.log("Message sent: " + response.message);
           }
      });
      response.render('thankyou', {
          title:'Thank you for sending me an email',
          saved: {email: email, name:name, needs:needs}
      });
    } else {
      console.log(errors);
      response.render('index', {
          title: 'Uh oh',
          errors: errors,
          saved: {email: email, name:name, needs:needs }
      });
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


