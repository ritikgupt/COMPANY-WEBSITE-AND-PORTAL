// prevents the use of undeclared variable
var News = require('../models/news');
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
router.get('/newnews', async(req, res) => {
  res.status(200).render('newnews');
});
router.post('/newnews', upload.single('news[file]'), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    News.create({
      title: req.body.news.title,
      file: result.secure_url,
      desc: req.body.news.desc,
      time: Date.now(),
    });
  });
  res.redirect('/adminhome');
});
router.get('/editnews', async(req, res) => {
  News.find({}, async(err, newss) => {
    if (err)
      console.log('err');
    else
      res.status(200).render('editnews', {newss: newss});
  });
});
router.get('/:id/editnews', async(req, res) => {
  News.findById(req.params.id, async(err, foundNews) => {

    if (err){
      res.redirect('/');
    } else {
      res.status(200).render('shownews', {news: foundNews});
    }
  });
});
router.delete('/:id/editnews', async(req, res) => {
  News.findByIdAndRemove(req.params.id, async(err) => {

    if (err){
      res.redirect('/editnews');
    } else {
      res.redirect('/editnews');
    }
  });
});
router.get('/:id/changephotonews', async(req, res) => {
  News.findById(req.params.id, async(err, foundNews) => {
    if (err){
      console.log('Error');
    } else {
      res.status(200).render('changephotonews', {news: foundNews});
    }
  });
});
router.post('/:id/changephotonews', upload.single('news[file]', {overwrite: true}), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    News.findByIdAndUpdate(req.params.id, {file: result.secure_url}, async(err) => {
      if (err){
        res.redirect('/adminhome');
      } else {
        res.redirect('/editnews');
      }
    });
  });
});
router.get('/:id/editnewsform', async(req, res) => {
  News.findById(req.params.id, async(err, foundNews) => {
    if (err){
      console.log('err');
    } else {
      res.status(200).render('editnewsform', {news: foundNews});
    }
  });
});
router.post('/:id/editnewsform', async(req, res) => {
  News.findByIdAndUpdate(req.params.id, req.body.news, async(err) => {
    if (err){
      res.redirect('/adminhome');
    } else {
      res.redirect('/editnews');
    }
  });
});
module.exports = router;
