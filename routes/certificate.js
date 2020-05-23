// prevents the use of undeclared variable
var express = require('express');
var router = express.Router();
var Certificate = require('../models/certificate');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dzsms0nne',
  api_key: '542159551497727',
  api_secret: 'yRkiZK6Gf4eNNhXqvrNI9WHFKM0',
});
router.get('/certificate', (req, res) => {
  res.status(200).render('certificate');
});
router.post('/certificate', upload.single('certificate[file]'), (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    Certificate.create({
      stu_id: req.body.certificate.stu_id,
      file: result.secure_url,
    });

  });
  res.redirect('/');
});
module.exports = router;


module.exports = router;
