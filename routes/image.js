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
router.get('/image', async(req, res) => {
  res.status(200).render('image');
});
router.post('/image', upload.single('image[file]'), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    Image.create({
      file: result.secure_url,
    });
  });
  res.redirect('/adminhome');
});
router.get('/editimage', async(req, res) => {
  Image.find({}, async(err, images) => {
    if (err)
      console.log('err');
    else
      res.status(200).render('editimage', {images: images});
  });
});
router.delete('/:id/editimage', async(req, res) => {
  Image.findByIdAndRemove(req.params.id, async(err) => {
    if (err){
      res.redirect('/editimage');
    } else {
      res.redirect('/editimage');
    }
  });
});
module.exports = router;
