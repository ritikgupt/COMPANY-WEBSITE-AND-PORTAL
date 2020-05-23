// prevents the use of undeclared variable
var Request = require('../models/request');
var Detail = require('../models/detail');
var a = require('express');
var router = a.Router();
router.get('/patent', async(req, res, next) => {
  var request = [];
  await Request.find({}, async(err, requests) => {
    if (err)
      console.log('err');
    else {
      for (var i = 0; i < requests.length; i++){
        if (requests[i].recep === 'Patent')
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
router.get('/patent/:id/show', async(req, res, next) => {
  // prevents the use of undeclared variable

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
      console.log(request);
      console.log(details);
      res.status(200).render('requestshow', {request: request, details: details});
    }
  });
});
module.exports = router;
