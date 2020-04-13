var a=require("express");
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
var app=a(); 
var Student=require("./models/student");
var Detail=require("./models/detail");
var Staff=require("./models/staff");
app.use(b.urlencoded({ extended: true }));
c.connect("mongodb://localhost:27017/amz", { useNewUrlParser: true,useFindAndModify : false,useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(a.static("public"));
c.set('useCreateIndex', true);
app.use(g());
app.use(f("_method"));
app.use(require("express-session")
({
  secret:"Let your work make the noise not your mouth.",
  resave:false,
  saveUninitialized:false  
}))
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new e(Staff.authenticate()));
// passport.serializeUser(Staff.serializeUser());
// passport.deserializeUser(Staff.deserializeUser());
passport.use( new e(Detail.authenticate()));
passport.serializeUser(Detail.serializeUser());
passport.deserializeUser(Detail.deserializeUser());

// app.get("/header",function(req,res){
//     res.render("header")
// })
app.get("/",function(req,res){
    res.render("amz");

})
// Detail.create({
//     username:"r",
//     password:"123",
//     email:"ritikgupta89369@gmail.com",
//     type:"Staff"
// })
app.get("/about",function(req,res){
    res.render("about");
})
app.get("/mechanical",function(req,res){
    res.render("mechanical");
})
app.get("/computer",function(req,res){
    res.render("computer");
})
app.get("/civil",function(req,res){
    res.render("civil");
})
app.get("/electrical",function(req,res){
    res.render("electrical");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",passport.authenticate("local",{
  successRedirect:"/dashboard",
  failureRedirect:"/login"
}))
app.get("/dashboard",function(req,res){
  console.log(req.user);
  if(req.user.type=="Staff")
  res.render("staff");
  else
  res.render("aspiring");
})
app.get("/logout",function(req,res){
    req.logout("aspiring");
    res.redirect("/");
})
app.get("/intern",function(req,res){
    res.render("intern");
})
app.get("/online",function(req,res){
    res.render("online");
})
app.get("/offline",function(req,res){
    res.render("offline");
})

app.get("/workshop",function(req,res){
    res.render("workshop");
})
  app.get("/aspiring",function(req,res){
     
      res.render("aspiring");
     }
    )
app.get("/forgot",function(req,res){
    res.render("forgot");
})
app.post("/forgot",function(req,res,next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20,function(err,buf){
                var token=buf.toString('hex');
                done(err,token);//token is that,which is to be send as the part of the url to the user's email address
            });
        },
        function(token,done){
            Detail.findOne({email:req.body.email},function(err,detail){
                if(!detail){
                    // req.flash('error',"No account with that email address exists.");
                    return res.redirect("/forgot");
                }
                detail.resetPasswordToken=token;
                detail.resetPasswordExpires=Date.now()+360000;
                detail.save(function(err){
                    done(err,token,detail);
                });
            });
        },
        function(token,detail,done){
            var transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'sonu3gupta@gmail.com',
                    pass:'7877773515'
                }
            });
            var mailOptions={
                to:detail.email,
                from:'sonu3gupta@gmail.com',
                subject:'Password Reset AMZ',
                text:'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
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
        res.redirect('/forgot');
    });
});
app.get('/reset/:token', function(req, res) {
    Detail.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, detail) {
      if (!detail) {
        // req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        Detail.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, detail) {
          if (!detail) {
           
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            console.log(req.body.confirm)
            detail.setPassword(req.body.password, function(err) {
              detail.resetPasswordToken = undefined;
              detail.resetPasswordExpires = undefined;
  
              detail.save(function(err) {
               console.log("Password Updated")
               console.log(req.body.password)
               console.log(detail.password)
               detail.password=req.body.password;
                done(err, detail); 
                res.redirect("/login");

              });
            })
          } else {
              
              return res.redirect('back');
          }
        });
      },
      function(detail, done) {
        var transporter = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'sonu3gupta@gmail.com',
            pass: '7877773515'
          }
        });
        var mailOptions = {
          to: detail.email,
          from: 'sonu3gupta@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + detail.email + ' has just been changed.\n'
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
app.get("/logout",function(req,res){
    req.logout();
    console.log(req.user)
    res.redirect("/login");
})
app.listen("3000",function(){
    console.log("Server has started.");
});