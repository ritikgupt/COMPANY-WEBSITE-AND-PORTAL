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
router.get('/newsponsor', async(req, res) => {
  res.status(200).render('newsponsor');
});
router.post('/newsponsor', upload.single('sponsor[file]'), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    Sponsor.create({
      file: result.secure_url,
    });
  });
  res.redirect('/adminhome');
});
router.get('/editsponsor', async(req, res) => {
  Sponsor.find({}, async(err, sponsors) => {
    if (err)
      console.log('err');
    else
      res.status(200).render('editsponsor', {sponsors: sponsors});
  });
});
router.delete('/:id/editsponsor', async(req, res) => {
  Sponsor.findByIdAndRemove(req.params.id, async(err) => {
    if (err){
      res.redirect('/editsponsor');
    } else {
      res.redirect('/editsponsor');
    }
  });
});
module.exports = router;
