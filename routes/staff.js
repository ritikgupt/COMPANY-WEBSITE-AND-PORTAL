var a=require("express");
var router=a.Router();
var b=require("body-parser");
var c=require("mongoose");
var f=require("method-override");
var g=require("express-sanitizer");
var passport=require("passport");
var e=require("passport-local");
var h=require("passport-local-mongoose");
var async=require("async");
var nodemailer=require("nodemailer");
var crypto=require("crypto");
var Staff=require("../models/staff");
passport.use('staff' ,new e(Staff.authenticate()));
passport.serializeUser(Staff.serializeUser());
passport.deserializeUser(Staff.deserializeUser());
router.get("/faculty",function(req,res){
    res.render("faculty");
})
router.post("/faculty", passport.authenticate("staff", {
    successRedirect: "/staff",
   failureRedirect:"/"
})
)
router.get("/forgot_staff",function(req,res){
    res.render("forgot_staff");
})
router.post("/forgot_staff",function(req,res,next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20,function(err,buf){
                var token=buf.toString('hex');
                done(err,token);//token is that,which is to be send as the part of the url to the user's email address
            });
        },
        function(token,done){
            Staff.findOne({email:req.body.email},function(err,staff){
                if(!staff){
                    // req.flash('error',"No account with that email address exists.");
                    return res.redirect("/forgot_staff");
                }
                staff.resetPasswordToken=token;
                staff.resetPasswordExpires=Date.now()+360000;
                staff.save(function(err){
                    done(err,token,staff);
                });
            });
        },
        function(token,staff,done){
            var transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'sonu3gupta@gmail.com',
                    pass:'7877773515'
                }
            });
            var mailOptions={
                to:staff.email,
                from:'sonu3gupta@gmail.com',
                subject:'Password Reset AMZ',
                text:'You are receiving this because you (or someone else) have requested the change of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset_staff/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                done(err, 'done');
            });
        }
    ],
    function(err) {
        if (err) return next(err);
        res.redirect('/forgot_staff');
    });
});
router.get('/reset_staff/:token', function(req, res) {
    Staff.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, staff) {
      if (!staff) {
        // req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot_staff');
      }
      res.render('reset_staff', {token: req.params.token});
    });
  });
  router.post('/reset_staff/:token', function(req, res) {
    async.waterfall([
      function(done) {
        Staff.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, staff) {
          if (!staff) {
           
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            console.log(req.body.confirm)
            staff.setPassword(req.body.password, function(err) {
              staff.resetPasswordToken = undefined;
              staff.resetPasswordExpires = undefined;
  
              staff.save(function(err) {
               console.log("Password Updated")
               console.log(req.body.password)
               console.log(staff.password)
               staff.password=req.body.password;
               console.log(staff.password)
                done(err, staff); 
                res.redirect("/faculty");

              });
            })
          } else {
              
              return res.redirect('back');
          }
        });
      },
      function(staff, done) {
        var transporter = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'sonu3gupta@gmail.com',
            pass: '7877773515'
          }
        });
        var mailOptions = {
          to: staff.email,
          from: 'sonu3gupta@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your  AMZ account ' + staff.email + ' has just been changed.\n'
        };
       transporter.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });
  module.exports=router;