var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Board';

// Admin only allowed to get all public Entries, everyone else gets their own
router.get('/', function(req, res) {
   
   var ssn = req.session;
   var cnn = req.cnn;
   async.waterfall([
      function(cb) {
         var userId = req.query.userId;
         if (userId)
            cnn.chkQry('select * from Board where prId = ?', 
             [userId], cb);
         else {
            if(vld.checkAdmin())
               cnn.chkQry('select * from Board', null, cb);
            }
      }, 
      function(entries, fields, cb) {
         res.status(200).json(entries);
         cb();
      }], 
      function(err) {
         cnn.release();
      });
});

router.get('/:id', function(req, res) {   
   var entId = req.params.id;
   var cnn = req.cnn;
   var vld = req.validator;
   async.waterfall([
      function(cb) {
         cnn.chkQry('select * from Board where id = ?', [entId], cb);
      }, 
      function(existingEnt, fields, cb) {
         if (vld.check(existingEnt.length, Tags.notFound, null, cb)) {
            existingEnt = existingEnt[0];
            if (!existingEnt.picURL) {
               existingEnt.picURL = null;
            }
            res.status(200).json(existingEnt);
            cb();
         }
      }], 
      function(err) {
         cnn.release();
      });
});


//    ownerId int,
//    bName varchar(80) not null,
//    heightFT int not null,
//    heightIN int not null,
//    picURL varchar(500),

router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var nLen = 80;


   async.waterfall([
   function(cb) {
      if (vld.chain(body.bName, Tags.missingField, ['bName'], cb)
          .chain(body.heightFT || body.heightFT >= 0, Tags.missingField, 
           ['heightFT'], cb)
          .check(body.heightIN || body.heightIN >= 0, Tags.missingField, 
           ['heightIN'], cb)
          &&
          vld.check(body.bName.length <= nLen, Tags.badValue, ['title'], cb)) {
            cnn.chkQry("insert into Board set ?", body, cb);
          }
          
   }, 
   function(insRes, fields, cb) {
      res.location(router.baseURL + '/' + insRes.insertId).end();
      cb();
   }], 
   function(err) {
      cnn.release();
   });
});

router.delete('/:bId', function(req, res) {
   var vld = req.validator;
   var bId = req.params.bId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Board where id = ?', [bId], cb);
   }, 
   function(boards, fields, cb) {
      if (vld.check(boards.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(parseInt(boards[0].ownerId), cb)) {
         cnn.chkQry('delete from Board where id = ?', [bId], cb);
      }
         
   }, 
   function(cnvs, fields, cb) {
      cb('ok');
      return;
   }], 
   function(err) {
      cnn.release();
      if (!err || err === 'ok')
         res.status(200).end();
   });
});

module.exports = router;