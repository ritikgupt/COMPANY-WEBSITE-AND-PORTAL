// prevents the use of undeclared variable
var Image = require('../models/image');
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
router.get('/image', function(req, res){
  res.render('image');
});
router.post('/image', upload.single('image[file]'), function(req, res){
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, function(err, result){
    if (err){
      console.log('err');
    }
    Image.create({
      file: result.secure_url,
    });
  });
  res.redirect('/adminhome');
});
router.get('/editimage', function(req, res){
  Image.find({}, function(err, images){
    if (err)
      console.log('err');
    else
      res.render('editimage', {images: images});
  });
});
router.delete('/:id/editimage', function(req, res){
  Image.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect('/editimage');
    } else {
      res.redirect('/editimage');
    }
  });
});
module.exports = router;
