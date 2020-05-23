// prevents the use of undeclared variable
var express = require('express');
var router = express.Router();
var Slider = require('../models/slider');
var Sponsor = require('../models/sponsor');
var Member = require('../models/member');
var News = require('../models/news');
var Image = require('../models/image');
router.get('/', async(req, res, next) => {
  var slider = [];
  var news = [];
  var sponsor = [];
  var image = [];
  var member = [];
  await Member.find({}, async(err, members) => {
    if (err)
      console.log('err');
    else {
      for (var i = 0; i < members.length; i++) {
        member.push(members[i]);
      }
    }

  });
  await Slider.find({}, async(err, sliders) => {
    if (err)
      console.log('err');
    else {
      for (var i = 0; i < sliders.length; i++) {
        slider.push(sliders[i]);
      }
    }

  });
  await News.find({}, async(err, newss) => {
    if (err)
      console.log('err');
    else {
      for (var i = 0; i < newss.length; i++) {
        news.push(newss[i]);
      }
    }

  });
  await Sponsor.find({}, async(err, sponsors) => {
    if (err)
      console.log('err');
    else {
      for (var i = 0; i < sponsors.length; i++) {
        sponsor.push(sponsors[i]);
      }
    }
  });
  await Image.find({}, async(err, images) => {
    if (err)
      console.log('err');
    else {
      for (var i = 0; i < images.length; i++) {
        image.push(images[i]);
      }
    }
  });
  res.status(200).render('amz', {news: news, slider: slider, sponsor: sponsor, image: image, member: member});
});

module.exports = router;
