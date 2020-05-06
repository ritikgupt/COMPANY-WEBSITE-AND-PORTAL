// prevents the use of undeclared variable
var Sponsor = require('../models/sponsor');
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
router.get('/newsponsor', function(req, res){
  res.render('newsponsor');
});
router.post('/newsponsor', upload.single('sponsor[file]'), function(req, res){
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, function(err, result){
    if (err){
      console.log('err');
    }
    Sponsor.create({
      file: result.secure_url,
    });
  });
  res.redirect('/adminhome');
});
router.get('/editsponsor', function(req, res){
  Sponsor.find({}, function(err, sponsors){
    if (err)
      console.log('err');
    else
      res.render('editsponsor', {sponsors: sponsors});
  });
});
router.delete('/:id/editsponsor', function(req, res){
  Sponsor.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect('/editsponsor');
    } else {
      res.redirect('/editsponsor');
    }
  });
});
module.exports = router;
