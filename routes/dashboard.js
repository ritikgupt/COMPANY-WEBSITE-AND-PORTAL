// prevents the use of undeclared variable
var Request = require('../models/request');
var Request_staff = require('../models/request_staff');
var Detail = require('../models/detail');
var Blog = require('../models/blog');
var passport = require('passport');
var E = require('passport-local');
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
passport.use(new E(Detail.authenticate()));
passport.serializeUser(Detail.serializeUser());
passport.deserializeUser(Detail.deserializeUser());
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else
    res.redirect('/login');
}

router.get('/login', async(req, res) => {
  Blog.find({}, async(err, blogs) => {
    if (err){
      console.log('err');
    } else {
      Blog.find({}, (err, blogs) => {
        if (err)
          console.log(err);
        else {
          res.status(200).render('login', {blogs: blogs});
        }
      });
    }
  });
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));
router.get('/dashboard', isLoggedIn, async(req, res) => {
  console.log(req.user);
  if (req.user.type === 'Employee')
    res.status(200).render('staff', {currentStaff: req.user});
  else
    res.status(200).render('aspiring', {currentStudent: req.user});
});
router.post('/dashboard', upload.single('request[req_file]'), (req, res, next) => {
  if (req.user.type === 'Student') {
    console.log(req.file);
    cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
      if (err){
        console.log('err');
      }
      Request.create(
        {
          desc: req.body.request.desc,
          recep: req.body.request.recep,
          stu_id: req.user.id,
          req_file: result.secure_url,
          accept: 'NO',
          date: Date.now(),
        }
      );
    });
    res.redirect('/dashboard');
  } else {
    Request_staff.create({
      desc: req.body.request_staff.desc,
      credit: req.body.request_staff.credit,
      purpose: req.body.request_staff.purpose,
      empid: req.user.id,
      date: req.body.request_staff.date,
    });
    res.redirect('/dashboard');
  }
});

module.exports = router;
