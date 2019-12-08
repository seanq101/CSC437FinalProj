var Express = require('express');
var Tags = require('../Validator.js').Tags;
var async = require('async');
var mysql = require('mysql');

var router = Express.Router({caseSensitive: true});

router.baseURL = '/Prss';

router.get('/', function(req, res) {
   if (req.session.isAdmin()) {
      var email = req.query.email;
   } else if (req.query.email) {
      var email = req.query.email;
   } else {
      var email = undefined;
   }

   var handler = function(err, prsArr) {
      if (!req.session.isAdmin()) {
         var temp = []
         prsArr.forEach(function(curPerson) {
            if (curPerson.id === req.session.prsId) {
               temp.push(curPerson);
            }
         });
         res.json(temp);
         req.cnn.release();
      } else {
         res.json(prsArr);
         req.cnn.release();
      }
      
   };

   if (email)
      req.cnn.chkQry("select id, email from Person where email LIKE ?", 
       '%' + email + '%', handler);
   else if (req.session.isAdmin())
      req.cnn.chkQry('select id, email from Person', null, handler);
   else
      req.cnn.chkQry('select id, email from Person where id = ?', 
      req.session.prsId, handler);
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var cnn = req.cnn;
   var admin = req.session && req.session.isAdmin()

   if (admin && (!body.password || body.password === ""))
      body.password = "*";                       // Blocking password
   body.whenRegistered = new Date();
   async.waterfall([
      function(cb) {
         if (vld.chain(body.email && body.email !== "", Tags.missingField, 
             ["email"])

             .chain(body.lastName && body.lastName !== "", Tags.missingField, 
             ["lastName"])

             .chain(body.password && body.password !== "", Tags.missingField, 
             ["password"])

             .check(body.role >= 0 && body.role <= 1, Tags.badValue, ["role"], 
              cb) && vld.chain(body.termsAccepted || admin, Tags.noTerms)) {
            cnn.chkQry('select * from Person where email = ?', body.email, cb)
         }
      }, 
      function(existingPrss, fields, cb) {
         if (vld.check(body.role === 0 || admin, Tags.forbiddenRole, 
             undefined, cb) && 
         vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
            if (!body.termsAccepted)
               body.termsAccepted = null;
            else {
               body.termsAccepted = new Date();            
            }
            cnn.chkQry('insert into Person set ?', body, cb);
         }
      }, 
      function(result, fields, cb) { 
         res.location(router.baseURL + '/' + result.insertId).end();
         cb();
      }], 
      function(err) {
         req.cnn.release();
      });
});

router.put('/:id', function(req, res) {
   var vld = req.validator;
   var ssn = req.session;
   var cnn = req.cnn;
   var body = req.body;

   async.waterfall([
      function(cb) {
         if (vld.checkPrsOK(parseInt(req.params.id), cb)) {
            if (Object.keys(req.body).length  === 0) {
               res.status(200).end();
               cb('ok');
               return;
            }

            //Check if we are an admin or are the right person
            if (vld.check(!("password" in req.body) || body.password !== null 
                && body.password !== "", Tags.badValue, ['password'], cb) &&

                vld.hasOnlyFields(Object.keys(req.body), 
                ['firstName', 'lastName', 'password', 'oldPassword', 'role']) &&

                vld.chain(!(req.body.role) || ssn.isAdmin(), 
                Tags.badValue, ["role"], cb)
                .check(!("password" in req.body) || (("password" in req.body) && 

                ("oldPassword" in req.body) && (req.body.oldPassword !== "")) || 
                ssn.isAdmin(), Tags.noOldPwd, null, cb)) {
                  cnn.chkQry('select * from Person where id = ?', 
                  req.params.id, cb);
            }
         } 
      }, 
      function(result, fields, cb) {
         if (vld.check(result.length, Tags.notFound, null, cb) &&
              vld.check(body.password && result[0].password === body.oldPassword 
              || body.password && ssn.isAdmin() || !body.password, 
              Tags.oldPwdMismatch, null, cb)) {
            
               // Do the update
            delete req.body.oldPassword;
            cnn.chkQry("update Person set ? where id = ?", [req.body, 
               req.params.id], cb);
         }
      }, 
      function(result, fields, cb) {
         cb();
      }], 
      function(err) {
         req.cnn.release();
         if (!err) {
            res.status(200).end();
         }
      });
});


router.get('/:id', function(req, res) {
   var vld = req.validator;

   async.waterfall([
      function(cb) {
      if (vld.checkPrsOK(parseInt(req.params.id), cb))
         req.cnn.chkQry('select * from Person where id = ?', [req.params.id], 
          cb);
      }, 
      function(prsArr, fields, cb) {
         if (vld.check(prsArr.length, Tags.notFound, undefined, cb)) {
            delete prsArr[0].password;
            prsArr[0].whenRegistered = new Date(prsArr[0].whenRegistered)
             .getTime();
            prsArr[0].termsAccepted = new Date(prsArr[0].termsAccepted)
             .getTime();
            res.json(prsArr);
            cb();
         }
      }], 
      function(err) {
         req.cnn.release();
      });
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;

   async.waterfall([
      function(cb) {
         
         if (vld.checkAdmin()) {
            req.cnn.chkQry('select * from Person where id = ?', 
             [req.params.id], cb);
         } else {
            req.cnn.release();
            return;
         }
      }, 
      function(prsArr, fields, cb) {
         if (vld.check(prsArr.length, Tags.notFound, undefined, cb)) {
            req.cnn.chkQry('DELETE from Person where id = ?', [req.params.id], 
             cb);
         }
      }, 
      function(prsArr, fields, cb) {
         cb('ok');
         
      }], 
      function(err) {
         req.cnn.release();
         if (!err || err === 'ok') {
            res.status(200).end();
         }
         
      });
});

module.exports = router;