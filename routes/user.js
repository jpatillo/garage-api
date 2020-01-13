var express = require('express');
var router = express.Router();
var mqtt = require('../mqtt');
var firebase = require('../firebase-service');

/* GET home page. */
router.get('/:userId', firebase.checkIfAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Garage API' });
});


var checkIfAuthorized = function (req, res, next) {
  

  next()
}

// Triggered when a user signs in (or simply opens) the app.
// This should only be used when the mobile app refreshes the user token.
router.post('/:userId/', firebase.checkIfAuthenticated, function(req,res,next) {
  console.log("sign in body: ",req.body)
  firebase.onSignIn(req.body);

  res.status(200).send({msg:'Signed in'});
});

module.exports = router;
