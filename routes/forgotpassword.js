// prevents the use of undeclared variable
var a = require('express');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var Detail = require('../models/detail');
var router = a.Router();
router.get('/forgot', async(req, res) => {
  res.status(200).render('forgot');
});

router.post('/forgot', async(req, res, next) => {
  async.waterfall([
    async(done) => {
      crypto.randomBytes(20, async(err, buf) => {
        var token = buf.toString('hex');
        done(err, token);// token is that,which is to be send as the part of the url to the user's email address
      });
    },
    async(token, done) => {
      Detail.findOne({email: req.body.email}, async(err, detail) => {
        if (err){
          console.log('err');
        }
        if (!detail){
          // req.flash('error',"No account with that email address exists.");
          return res.redirect('/forgot');
        }
        detail.resetPasswordToken = token;
        detail.resetPasswordExpires = Date.now() + 360000;
        detail.save(async(err) => {
          done(err, token, detail);
        });
      });
    },
    async(token, detail, done) => {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sonu3gupta@gmail.com',
          pass: '7877773515',
        },
      });
      var mailOptions = {
        to: detail.email,
        from: 'sonu3gupta@gmail.com',
        subject: 'Password Reset AMZ',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };
      transporter.sendMail(mailOptions, async(err) => {
        console.log('mail sent');
        done(err, 'done');
      });
    },
  ],
  async(err) => {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});
router.get('/reset/:token', async(req, res) => {
  Detail.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async(err, detail) => {
    if (err){
      console.log('err');
    }
    if (!detail) {
      // req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.status(200).render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', async(req, res) => {
  async.waterfall([
    async(done) => {
      Detail.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async(err, detail) => {
        if (err){
          console.log('err');
        }
        if (!detail) {

          return res.redirect('back');
        }
        if (req.body.password === req.body.confirm) {

          detail.setPassword(req.body.password, async(err) => {
            if (err){
              console.log('err');
            }
            detail.resetPasswordToken = undefined;
            detail.resetPasswordExpires = undefined;

            detail.save(async(err) => {
              detail.password = req.body.password;
              done(err, detail);
              res.redirect('/logout');

            });
          });
        } else {

          return res.redirect('back');
        }
      });
    },
    async(detail, done) => {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'sonu3gupta@gmail.com',
          pass: '7877773515',
        },
      });
      var mailOptions = {
        to: detail.email,
        from: 'sonu3gupta@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + detail.email + ' has just been changed.\n',
      };
      transporter.sendMail(mailOptions, async(err) => {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    },
  ], async(err) => {
    if (err){
      console.log('err');
    }
    res.redirect('/');
  });
});
module.exports = router;
