var Request = require('../models/request');
var express = require('express');
var router = express.Router();
router.get('/requests', (req, res) => {
  Request.find({}, (err, requests) => {
    if (err) {
      console.log('err');
    } else {
      res.render('requests', {user: req.user, requests: requests});
    }
  });
}
);
router.get('/hello/:id/edit', (req, res) => {
  Request.findById(req.params.id, (err, foundRequest) => {
    if (err){
      console.log('err');
    } else {
      res.render('editrequest', {request: foundRequest});
    }
  });
});
router.post('/hello/:id/edit', (req, res) => {
  Request.findByIdAndUpdate(req.params.id, req.body.request, (err, request) => {
    if (err){
      console.log('err');
    } else {
      res.redirect('/requests');
    }
  });
});
module.exports = router;
