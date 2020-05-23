// prevents the use of undeclared variable

var express = require('express');
var router = express.Router();
var Slider = require('../models/slider');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dzsms0nne',
  api_key: '542159551497727',
  api_secret: 'yRkiZK6Gf4eNNhXqvrNI9WHFKM0',
});
router.get('/newslider', async(req, res) => {
  res.status(200).render('newslider');
});
router.post('/newslider', upload.single('slider[file]'), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    Slider.create({
      file: result.secure_url,
    });
    res.redirect('/');
  });
});
router.get('/editslider', async(req, res) => {
  Slider.find({}, async(err, sliders) => {
    if (err)
      console.log(err);
    else
      res.status(200).render('editslider', {sliders: sliders});
  });
});
router.delete('/:id/editslider', async(req, res) => {
  Slider.findByIdAndRemove(req.params.id, async(err) => {
    if (err){
      res.redirect('/editslider');
    } else {
      res.redirect('/editslider');
    }
  });
});
module.exports = router;
