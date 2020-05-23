// prevents the use of undeclared variable
var express = require('express');
var router = express.Router();
var Certificate = require('../models/certificate');
router.get('/verify', (req, res) => {
  res.status(200).render('verify');
});
router.post('/verify', (req, res) => {
  console.log(req.body.stu_id);
  Certificate.findOne({stu_id: req.body.stu_id}, (err, certificate) => {
    if (err)
      console.log('error');
    else {
      res.status(200).render('showcertificate', {certificate: certificate});
    }
  });
});
module.exports = router;
