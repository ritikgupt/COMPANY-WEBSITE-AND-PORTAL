// prevents the use of undeclared variable
var Member = require('../models/member');
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
router.get('/newmember', function(req, res){
  res.render('newmember');
});
router.post('/newmember', upload.single('member[file]'), function(req, res){
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, function(err, result){
    if (err){
      console.log('err');
    }
    Member.create({
      file: result.secureurl,
      name: req.body.member.name,
      designation: req.body.member.designation,
      linkedIn: req.body.member.linkedIn,
    });
  });
  res.redirect('/adminhome');
});
router.get('/editmember', function(req, res){
  Member.find({}, function(err, members){
    if (err)
      console.log('err');
    else
      res.render('editmember', {members: members});
  });
});
router.get('/:id/editmember', function(req, res){
  Member.findById(req.params.id, function(err, foundMember){
    if (err){
      res.redirect('/');
    } else {
      res.render('showmember', {member: foundMember});
    }
  });
});
router.delete('/:id/editmember', function(req, res){
  Member.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect('/editmember');
    } else {
      res.redirect('/editmember');
    }
  });
});
router.get('/:id/changephotomember', function(req, res){
  Member.findById(req.params.id, function(err, foundMember){
    if (err){
      console.log('Error');
    } else {
      res.render('changephotomember', {member: foundMember});
    }
  });
});
router.post('/:id/changephotomember', upload.single('member[file]', {overwrite: true}), function(req, res){
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, function(err, result){
    if (err){
      console.log('err');
    }
    Member.findByIdAndUpdate(req.params.id, {file: result.secure_url}, function(err){
      if (err){
        res.redirect('/adminhome');
      } else {
        res.redirect('/editmember');
      }
    });
  });
});
router.get('/:id/editmemberform', function(req, res){
  Member.findById(req.params.id, function(err, foundMember){
    if (err){
      console.log('err');
    } else {
      res.render('editmemberform', {member: foundMember});
    }
  });
});
router.post('/:id/editmemberform', function(req, res){
  Member.findByIdAndUpdate(req.params.id, req.body.member, function(err){
    if (err){
      res.redirect('/adminhome');
    } else {
      res.redirect('/editmember');
    }
  });
});
module.exports = router;
