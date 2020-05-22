// prevents the use of undeclared variable
var Request = require('../models/request');
var Detail = require('../models/detail');
var Blog = require('../models/blog');
var a = require('express');
var router = a.Router();
router.get('/Blog', async(req, res, next) => {
  var request = [];
  await Request.find({}, function(err, requests){
    if (err)
      console.log('err');
    else {
      for (var i = 0; i < requests.length; i++){
        if (requests[i].recep === 'Blog')
          request.push(requests[i]);
      }
    }
  });
  await Detail.find({}, function(err, details){
    if (err)
      console.log('err');
    else {
      res.render('patent', {details: details, request: request});
    }
  });
});
router.get('/Blog/:id/show', async(req, res, next) => {
  // prevents the use of undeclared variable

  var request = [];
  await Request.findById(req.params.id, function(err, foundRequest){
    if (err)
      console.log('err');
    else
      request.push(foundRequest);
  });
  await Detail.find({}, function(err, details){
    if (err)
      console.log('err');
    else {
      console.log(request);
      console.log(details);
      res.render('blogshow', {request: request, details: details});
    }
  });
});
router.post('/:id/blog', async(req, res) => {
  await Request.findByIdAndRemove(req.params.id, (err) => {
    if (err){
      console.log('err');
    } else {
      res.redirect('/Blog');
    }
  });
});
router.post('/:id/blogdisplay', async(req, res) => {
  console.log(req.params.id);
  Request.findById(req.params.id, (err, request) => {
    if (err){
      console.log(err);
    } else {
      Blog.create({
        stu_id: request.stu_id,
        desc: request.desc,
        photo: request.req_file,
        date: Date.now(),
      });

    }
  });
});
module.exports = router;
