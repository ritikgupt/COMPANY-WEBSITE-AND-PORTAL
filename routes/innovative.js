// prevents the use of undeclared variable
var Request = require('../models/request');
var Detail = require('../models/detail');
var a = require('express');
var router = a.Router();
router.get('/InnovativeIdea', async(req, res, next) => {
  var request = [];
  await Request.find({}, async(err, requests) => {
    if (err)
      console.log('err');
    else {
      for (var i = 0; i < requests.length; i++){
        if (requests[i].recep === 'InnovativeIdea')
          request.push(requests[i]);
      }
    }
  });
  await Detail.find({}, async(err, details) => {
    if (err)
      console.log('err');
    else {
      res.status(200).render('patent', {details: details, request: request});
    }
  });

});
router.get('/InnovativeIdea/:id/show', async(req, res, next) => {
  var request = [];
  await Request.findById(req.params.id, async(err, foundRequest) => {
    if (err)
      console.log('err');
    else
      request.push(foundRequest);
  });
  await Detail.find({}, async(err, details) => {
    if (err)
      console.log('err');
    else {
      res.status(200).render('requestshow', {details: details, request: request});
    }
  });

});
module.exports = router;
