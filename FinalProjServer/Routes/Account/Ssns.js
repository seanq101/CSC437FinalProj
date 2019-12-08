var Express = require('express');
var Tags = require('../Validator.js').Tags;
var async = require('async');

var {Session, router} = require('../Session.js');
var router = Express.Router({caseSensitive: true});

router.baseURL = '/Ssns';

router.get('/', function(req, res) {
   var body = [], ssn;

   if (req.validator.checkAdmin()) {
      Session.getAllIds().forEach(id => {
         ssn = Session.findById(id);
         body.push({id: ssn.id, prsId: ssn.prsId, loginTime: ssn.loginTime});
      });
      res.status(200).json(body);
      req.cnn.release();
   } else {
      req.cnn.release();
   }
});

router.post('/', function(req, res) {
   var ssn;
   var cnn = req.cnn;
   cnn.chkQry('select * from Person where email = ?', [req.body.email], 
   function(err, result) {
      if (req.validator.check(result && result.length && result[0].password ===
       req.body.password, Tags.badLogin)) {
         ssn = new Session(result[0], res);
         res.location(router.baseURL + '/' + ssn.id).status(200).end();
      }
      cnn.release();
   });
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;
   var ssn = Session.findById(req.params.id);

   async.waterfall([
      function(cb) {
         if (vld.check(ssn, Tags.notFound, undefined, cb) && 
             vld.checkPrsOK(parseInt(ssn.prsId), cb)) {
            ssn.logOut();
            cb();
         }
      }
   ], 
   function(err) {
      req.cnn.release();
      if (!err) {
         res.status(200).end();
      }
   });
});

router.get('/:id', function(req, res) {
   var vld = req.validator;
   var ssn = Session.findById(req.params.id);

   async.waterfall([
      function(cb) {
         if (vld.check(ssn, Tags.notFound, null, cb) && 
             vld.checkPrsOK(parseInt(ssn.prsId), cb)) {
            res.status(200).json({id: ssn.id, prsId: ssn.prsId, 
             loginTime: ssn.loginTime});
             cb();
         }
      }

   ], 
      function(err) {
         req.cnn.release();
      });
});

module.exports = router;
