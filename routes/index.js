var express = require('express');
var router = express.Router();
var mqtt = require('../mqtt');
var firebase = require('../firebase-service');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Garage API' });
});

router.get('/garage/open', firebase.checkIfAuthenticated, function(req,res,next) {
  // the device id will be in the payload so we can encrypt it
  // testing with device id 34567
  // will have to validate the device id against the user
  mqtt.publish('garage/'+34567+'/command/door',"pop");
  res.render('index', { title: 'publish please' });
});

module.exports = router;
