var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Cnvs';

router.get('/', function(req, res) {
   
   var ownerId = req.query.owner;
   var cnn = req.cnn;
   async.waterfall([
      function(cb) {
         if (ownerId) {
            cnn.chkQry('select * from Conversation where ownerId = ?', 
             [ownerId], cb);
         } else {
            cnn.chkQry('select * from Conversation', null, cb);
         }
      }, 
      function(existingCnv, fields, cb) {
         for (var i = 0; i < existingCnv.length; i++) {
            if (existingCnv[i].lastMessage !== null) {
               existingCnv[i].lastMessage = 
                new Date(existingCnv[i].lastMessage).getTime();
            }
         }
         res.status(200).json(existingCnv);
         cb();
      }], 
      function(err) {
         cnn.release();
      });
});

router.get('/:id', function(req, res) {   
   var cnvId = req.params.id;
   var cnn = req.cnn;
   var vld = req.validator;
   async.waterfall([
      function(cb) {
            cnn.chkQry('select * from Conversation where id = ?', 
             [cnvId], cb);
      }, 
      function(existingCnv, fields, cb) {
         if (vld.check(existingCnv.length, Tags.notFound, null, cb)) {
            existingCnv = existingCnv[0];
            if (!existingCnv.lastMessage) {
               existingCnv.lastMessage = null;
            }
            res.status(200).json(existingCnv);
            cb();
         }
      }], 
      function(err) {
         cnn.release();
      });
});

router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var tlen = 80;
   async.waterfall([
   function(cb) {
      if (vld.check(body.title, Tags.missingField, ['title'], cb) && 
          vld.check(body.title.length <= tlen, Tags.badValue, ['title'], cb))
          cnn.chkQry('select * from Conversation where title = ?', body.title, 
          cb);
   }, 
   function(existingCnv, fields, cb) {
      body.ownerId = req.session.prsId;
      if (vld.check(!existingCnv.length, Tags.dupTitle, null, cb)) {
         cnn.chkQry("insert into Conversation set ?", body, cb);
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

router.put('/:cnvId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;
   var tlen = 80;
   async.waterfall([
   function(cb) {
      if (vld.check(req.body.length !== 0 && req.body.title, 
          Tags.missingField, ['title'], cb) &&
          vld.check(req.body.title.length <= tlen, Tags.badValue, ['title'], 
          cb)) {
            cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
         }  
   }, 
   function(cnvs, fields, cb) {
      if (vld.check(cnvs.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(parseInt(cnvs[0].ownerId), cb))
         cnn.chkQry('select * from Conversation where title = ?', 
          [body.title], cb);
   }, 
   function(sameTtl, fields, cb) {
      if (vld.check(!sameTtl.length, Tags.dupTitle, null, cb)) {
         var newBody = {"title" : body.title};
         cnn.chkQry("update Conversation set ? where id = ?", 
          [newBody, cnvId], cb);
      }
   }], 
   function(err) {
      req.cnn.release();
      if (!err) {
         res.status(200).end();
      }
   });
});

router.delete('/:cnvId', function(req, res) {
   var vld = req.validator;
   var cnvId = req.params.cnvId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   }, 
   function(cnvs, fields, cb) {
      if (vld.check(cnvs.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(parseInt(cnvs[0].ownerId), cb)) {
         cnn.chkQry('delete from Conversation where id = ?', [cnvId], cb);
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

router.get('/:cnvId/Msgs', function(req, res) {   
   var num = req.query.num;
   var dateTime = req.query.dateTime;
   var vld = req.validator;
   var cnn = req.cnn;
   var copy = [];
   async.waterfall([
      function(cb) {
         cnn.chkQry('select * from Message where cnvId = ?', 
         req.params.cnvId, cb);
      }, 
      function(msgs, fields, cb) {
         if (vld.check(msgs.length || dateTime || num, Tags.notFound, null, 
             cb)) {
            for (var i = 0; i < msgs.length; i++) {
               msgDT = new Date(msgs[i].whenMade);
               msgs[i].whenMade = msgDT.getTime();
               delete msgs[i].cnvId;

               if (dateTime && msgs[i].whenMade > parseInt(dateTime)) {
                  copy.push(msgs[i]);
               } else if (!dateTime) {
                  copy.push(msgs[i]);
               }
            }
            cnn.chkQry('select * from Person', null, cb);
         }
      }, 
      function(people, fields, cb) {
         for (var i = 0; i < people.length; i++) {
            for (var j = 0; j < copy.length; j ++) {
               if (copy[j].prsId === people[i].id) {
                  copy[j].email = people[i].email;
               }
            }
         }
         if (num) {
            copy = copy.splice(0, parseInt(num))
         }
         
         res.json(copy);
         cb();
      }], 
   function(err) {
      if (!err)
         res.status(200);
      cnn.release();
   });
});

router.post('/:cnvId/Msgs', function(req, res) {   
   var content = req.body.content;
   var ssn = req.session;
   var now = new Date();
   var vld = req.validator;
   var cnn = req.cnn;
   var locat = undefined;
   async.waterfall([
      function(cb) {
         if (vld.check(content , Tags.missingField, ['content'], cb) && 
             vld.check(content.length <= 5000, Tags.badValue, ['content'], 
             cb)) {
            
            var body = {
               cnvId: parseInt(req.params.cnvId), 
               prsId: ssn.prsId, 
               whenMade: now, 
               content: content
            }
            cnn.chkQry("insert into Message set ?", body, cb);
         }
            
      }, 
      function(insRes, fields, cb) {
         locat = insRes.insertId;
         var body = {
            lastMessage: now
         }
         cnn.chkQry('update Conversation set ? where id = ?', 
         [body, req.params.cnvId], cb);
         
      }, 
      function(result, fields, cb) {
         res.location(router.baseURL + '/' + locat).end();
         cb();
      }
   ], 
   function(err) {
      cnn.release();
   });
});

module.exports = router;