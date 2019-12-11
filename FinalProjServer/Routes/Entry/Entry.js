var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Entry';

// Admin only allowed to get all public Entries, everyone else gets their own
router.get('/', function(req, res) {
   
   var ssn = req.session;
   var cnn = req.cnn;
   async.waterfall([
      function(cb) {
         var getPublic = req.query.pub;
         if (!getPublic)
            cnn.chkQry('select * from Entry where ownerId = ?', 
             [ssn.prsId], cb);
         else {
            console.log('got a public')
            cnn.chkQry('select * from Entry where pub = 1',
             [ssn.prsId], cb);
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
            cnn.chkQry('select * from Entry where id = ?', 
             [entId], cb);
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


//title varchar(80) not null,
// waveHeight int not null,
// content varchar(1000) not null,
// rating int not null,
// loc varchar(80) not null,
// public int not null,
// whenSurfed datetime(3) not null,

router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var tLen = 80;
   var cLen= 1000;
   var lLen = 80;

   async.waterfall([
   function(cb) {
      if (vld.chain(body.waveHeight, Tags.missingField, ['waveHeight'], cb)
          .chain(body.content, Tags.missingField, ['content'], cb)
          .chain(body.rating, Tags.missingField, ['rating'], cb)
          .chain(body.loc, Tags.missingField, ['loc'], cb)
          .chain(body.pub === 0 || body.pub === 1, 
           Tags.missingField, ['pub'], cb)
          .chain(body.whenSurfed, Tags.missingField, ['whenSurfed'], cb)
          .check(body.title, Tags.missingField, ['title'], cb) && 
          vld.chain(body.title.length <= tLen, Tags.badValue, ['title'], cb)
           .chain(body.content.length <= cLen, Tags.badValue, ['content'], cb)
           .check(body.loc.length <= lLen, Tags.badValue, ['loc'], cb)
          ){
             body.whenSurfed = new Date(body.whenSurfed);
             console.log('body: ', body)
            cnn.chkQry("insert into Entry set ?", body, cb);
          }
          
   }, 
   function(insRes, fields, cb) {
      console.log('insRes: ', insRes)
      res.location(router.baseURL + '/' + insRes.insertId).end();
      cb();
   }], 
   function(err) {
      cnn.release();
   });
});

router.delete('/:entId', function(req, res) {
   var vld = req.validator;
   var entId = req.params.entId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Entry where id = ?', [entId], cb);
   }, 
   function(ents, fields, cb) {
      if (vld.check(ents.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(parseInt(ents[0].ownerId), cb)) {
         cnn.chkQry('delete from Entry where id = ?', [entId], cb);
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