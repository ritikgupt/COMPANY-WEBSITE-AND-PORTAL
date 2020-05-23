var Request = require('../models/request');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dzsms0nne',
  api_key: '542159551497727',
  api_secret: 'yRkiZK6Gf4eNNhXqvrNI9WHFKM0',
});
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
router.get('/hello/:id/changefile', (req, res) => {
  Request.findById(req.params.id, (err, foundRequest) => {
    if (err){
      console.log('err');
    } else {
      res.render('changerequestfile', {request: foundRequest});
    }
  });
});
router.post('/hello/:id/changefile', upload.single('request[req_file]', {overwrite: true}), (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    console.log('entered');
    if (err){
      console.log('err');
    }
    Request.findByIdAndUpdate(req.params.id, {req_file: result.secure_url}, async(err) => {
      if (err){
        res.redirect('/adminhome');
      } else {
        res.redirect('/requests');
      }
    });
  });
});
module.exports = router;
