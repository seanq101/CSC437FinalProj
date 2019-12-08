var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Msgs';

router.get('/:id', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var ourMsg = undefined;
   async.waterfall([
      function(cb) {            
         cnn.chkQry('select * from Message where id = ?', 
            req.params.id, cb);
      }, 
      function(result, fields, cb) {
         if (vld.check(result.length, Tags.notFound, null, cb)) {
            ourMsg = result[0];
            cnn.chkQry('select * from Person where id = ?', 
            result[0].prsId, cb);
         }
      }, 
      function(person, fields, cb) {
         ourMsg.email = person[0].email;
         delete ourMsg.prsId;
         delete ourMsg.cnvId;
         delete ourMsg.id;
         if (ourMsg.whenMade) {
            var temp = new Date(ourMsg.whenMade).getTime();
            ourMsg.whenMade = temp;
         } else {
            ourMsg.whenMade = null;
         }

         res.json(ourMsg);
         cb();
      }], 
      function(err) {
         if (!err)
            res.status(200);
         cnn.release();
      });
});

module.exports = router;
