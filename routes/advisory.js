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
router.get('/newmember', async(req, res) => {
  res.status(200).render('newmember');
});
router.post('/newmember', upload.single('member[file]'), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
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
router.get('/editmember', async(req, res) => {
  Member.find({}, async(err, members) => {
    if (err)
      console.log('err');
    else
      res.status(200).render('editmember', {members: members});
  });
});
router.get('/:id/editmember', async(req, res) => {
  Member.findById(req.params.id, async(err, foundMember) => {
    if (err){
      res.redirect('/');
    } else {
      res.status(200).render('showmember', {member: foundMember});
    }
  });
});
router.delete('/:id/editmember', async(req, res) => {
  Member.findByIdAndRemove(req.params.id, async(err) => {
    if (err){
      res.redirect('/editmember');
    } else {
      res.redirect('/editmember');
    }
  });
});
router.get('/:id/changephotomember', async(req, res) => {
  Member.findById(req.params.id, async(err, foundMember) => {
    if (err){
      console.log('Error');
    } else {
      res.status(200).render('changephotomember', {member: foundMember});
    }
  });
});
router.post('/:id/changephotomember', upload.single('member[file]', {overwrite: true}), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    Member.findByIdAndUpdate(req.params.id, {file: result.secure_url}, async(err) => {
      if (err){
        res.redirect('/adminhome');
      } else {
        res.redirect('/editmember');
      }
    });
  });
});
router.get('/:id/editmemberform', async(req, res) => {
  Member.findById(req.params.id, async(err, foundMember) => {
    if (err){
      console.log('err');
    } else {
      res.status(200).render('editmemberform', {member: foundMember});
    }
  });
});
router.post('/:id/editmemberform', async(req, res) => {
  Member.findByIdAndUpdate(req.params.id, req.body.member, async(err) => {
    if (err){
      res.redirect('/adminhome');
    } else {
      res.redirect('/editmember');
    }
  });
});
module.exports = router;
