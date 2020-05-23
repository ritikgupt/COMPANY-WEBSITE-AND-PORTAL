// prevents the use of undeclared variable
var Workshop = require('../models/workshop');
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
router.get('/newworkshop', async(req, res) => {
  res.render('newworkshop');
});
router.get('/workshop', async(req, res, next) => {
  await Workshop.find({}, async(err, workshops) => {
    if (err)
      console.log(err);
    else {
      res.render('workshop', {workshops: workshops});
    }

  });

}
);
router.post('/newworkshop', upload.single('workshop[file]'), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    Workshop.create({
      title: req.body.workshop.title,
      file: result.secure_url,
      desc: req.body.workshop.desc,
      time: Date.now(),
    });
  });
  res.redirect('/workshop');
});
router.get('/editworkshop', async(req, res) => {
  Workshop.find({}, async(err, workshops) => {
    if (err)
      console.log('err');
    else
      res.render('editworkshop', {workshops: workshops});
  });
});
router.get('/:id/editworkshop', async(req, res) => {
  Workshop.findById(req.params.id, async(err, foundWorkshop) => {
    if (err){
      res.redirect('/');
    } else {
      res.render('showworkshop', {workshop: foundWorkshop});
    }
  });
});
router.delete('/:id/editworkshop', async(req, res) => {
  Workshop.findByIdAndRemove(req.params.id, async(err) => {
    if (err){
      res.redirect('/editworkshop');
    } else {
      res.redirect('/editworkshop');
    }
  });
});
router.get('/:id/changephotoworkshop', async(req, res) => {
  Workshop.findById(req.params.id, async(err, foundWorkshop) => {
    if (err){
      console.log('Error');
    } else {
      res.render('changephotoworkshop', {workshop: foundWorkshop});
    }
  });
});
router.post('/:id/changephotoworkshop', upload.single('workshop[file]', {overwrite: true}), async(req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, async(err, result) => {
    if (err){
      console.log('err');
    }
    Workshop.findByIdAndUpdate(req.params.id, {file: result.secure_url}, async(err) => {
      if (err){
        res.redirect('/adminhome');
      } else {
        res.redirect('/editworkshop');
      }
    });
  });
});
router.get('/:id/editworkshopform', async(req, res) => {
  Workshop.findById(req.params.id, async(err, foundWorkshop) => {
    if (err){
      console.log('err');
    } else {
      res.render('editworkshopform', {workshop: foundWorkshop});
    }
  });
});
router.post('/:id/editworkshopform', async(req, res) => {
  Workshop.findByIdAndUpdate(req.params.id, req.body.workshop, async(err) => {
    if (err){
      res.redirect('/adminhome');
    } else {
      res.redirect('/editworkshop');
    }
  });
});
module.exports = router;
