var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var {Session, router} = require('./Routes/Session.js');
var Validator = require('./Routes/Validator.js');
var CnnPool = require('./Routes/CnnPool.js');
var async = require('async');

var app = express();

// Static paths to be served like index.html and all client side js
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   res.header("Access-Control-Allow-Credentials", true);
   res.header("Access-Control-Allow-Headers", "Content-Type");
   res.header("Access-Control-Allow-Methods", 
    "POST, GET, OPTIONS, PUT, DELETE");
   res.header("Access-Control-Expose-Headers", "Location");

   next();
});

// No further processing needed for options calls.
app.options("/*", function(req, res) {
   res.status(200).end();
});

// Static path to index.html and all clientside js
// Parse all request bodies using JSON
app.use(bodyParser.json());

// No messing w/db ids
app.use(function(req, res, next) {delete req.body.id; next();});

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(router);

// Check general login.  If OK, add Validator to |req| and continue processing
// otherwise respond immediately with 401 and noLogin error tag.
app.use(function(req, res, next) {
   if (req.session || (req.method === 'POST' &&
      (req.path === '/Prss' || req.path === '/Ssns'))) {
      req.validator = new Validator(req, res);
      next();
   } else
      res.status(401).end();
});

// Add DB connection, with smart chkQry method, to |req|
app.use(CnnPool.router);

// Load all subroutes
app.use('/Prss', require('./Routes/Account/Prss.js'));
app.use('/Ssns', require('./Routes/Account/Ssns.js'));
app.use('/Cnvs', require('./Routes/Conversation/Cnvs.js'));
app.use('/Msgs', require('./Routes/Conversation/Msgs.js'));
app.use('/Entry', require('./Routes/Entry/Entry.js'));
app.use('/Board', require('./Routes/Board/Board.js'));

// Special debugging route for /DB DELETE.  Clears all table contents
//resets all auto_increment keys to start at 1, and reinserts one admin user.
app.delete('/DB', function(req, res) {

   var vld = req.validator;
   
   // Callbacks to clear tables
   var cbs = ["Conversation", "Message", "Person"].map(
      table => function(cb) {
         req.cnn.query("delete from " + table, null, cb);
      });

   // Callbacks to reset increment bases
   cbs = cbs.concat(["Conversation", "Message", "Person"].map(
      table => cb => {
         req.cnn.query("alter table " + table + " auto_increment = 1", 
         null, cb);
      }));

   // Callback to reinsert admin user
   cbs.push(cb => {
      req.cnn.query('INSERT INTO Person (firstName, lastName, email, ' +
         'password, whenRegistered, role) VALUES ' +
         '("Joe", "Admin", "adm@11.com", "password", NOW(), 1);', null, cb);
   });

   // Callback to clear sessions, release connection and return result
   cbs.push(callback => {
      Session.getAllIds().forEach(id => {
         Session.findById(id).logOut();
      });
      callback();
   });
   if (vld.checkAdmin())
      async.series(cbs, err => {
         req.cnn.release();
         if (err)
            res.status(400).json(err);
         else
            res.status(200).end();
      });
   else {
      req.cnn.release();
   }
});

// Anchor handler for general 404 cases.
app.use(function(req, res) {
   res.status(404).end();
   res.cnn.release();
});

// Handler of last resort.  Send a 500 response with stacktrace as the body.
app.use(function(err, req, res, next) {
   res.status(500).json(err.stack);
   req.cnn && req.cnn.release();
});

app.set('portNum', process.argv[process.argv.length - 2] === 'p' ? 
 4000 : process.argv[process.argv.length - 1]);

app.listen(app.get('portNum'), function() {});