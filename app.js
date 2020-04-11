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
var staffRoutes=require("./routes/staff");
var Student=require("./models/student");
var Staff=require("./models/staff");
app.use(b.urlencoded({ extended: true }));
c.connect("mongodb://localhost:27017/amz", { useNewUrlParser: true,useFindAndModify : false,useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(a.static("public"));
c.set('useCreateIndex', true);
app.use(g());
app.use(f("_method"));
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    //the above function will help to add currentUser variable to routes
    next();
    //without next() we won't be able to add currentUser to all the routes,it will add to one route and then stop
    //nothing will happen after that so to avoid this next() is used.
});
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
passport.use( 'student',new e(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// app.get("/header",function(req,res){
//     res.render("header")
// })
app.get("/",function(req,res){
    res.render("amz");
})
// Staff.create({
//     username:"r",
//     password:"123",
//     email:"ritikgupta89369@gmail.com"
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
    res.render("student");
})
app.post("/login", passport.authenticate("student", {
    successRedirect: "/aspiring",
    failureRedirect: "/"
})
)
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})
app.get("/adminlogin",function(req,res){
    res.render("adminlogin");
})
app.get("/aspiring",function(req,res){
    res.render("aspiring");
})
app.get("/staff",function(req,res){
    res.render("staff");
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

app.get("/forgot_admin",function(req,res){
    res.render("forgot_admin");
})
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
            Student.findOne({email:req.body.email},function(err,student){
                if(!student){
                    // req.flash('error',"No account with that email address exists.");
                    return res.redirect("/forgot");
                }
                student.resetPasswordToken=token;
                student.resetPasswordExpires=Date.now()+360000;
                student.save(function(err){
                    done(err,token,student);
                });
            });
        },
        function(token,student,done){
            var transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'sonu3gupta@gmail.com',
                    pass:'7877773515'
                }
            });
            var mailOptions={
                to:student.email,
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
    Student.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, student) {
      if (!student) {
        // req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        Student.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, student) {
          if (!student) {
           
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            console.log(req.body.confirm)
            student.setPassword(req.body.password, function(err) {
              student.resetPasswordToken = undefined;
              student.resetPasswordExpires = undefined;
  
              student.save(function(err) {
               console.log("Password Updated")
               console.log(req.body.password)
               console.log(student.password)
               student.password=req.body.password;
                done(err, student); 
                res.redirect("/login");

              });
            })
          } else {
              
              return res.redirect('back');
          }
        });
      },
      function(student, done) {
        var transporter = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'sonu3gupta@gmail.com',
            pass: '7877773515'
          }
        });
        var mailOptions = {
          to: student.email,
          from: 'sonu3gupta@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + student.email + ' has just been changed.\n'
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
// app.get("/team",function(req,res){
    //     res.render("create_team")
    // })
    // app.post("/team",function(req,res){
    //     Team.create({ 
    //         name:req.body.team.name,
    //         designation:req.body.team.designation,
    //         email:req.body.team.email,
    //         linkedin:req.body.team.linkedin,
    //         github:req.body.team.github,
    //         number:req.body.team.number,
    //         image:req.body.team.image,
    //         type:req.body.team.type,
    //     }) 
    //     res.redirect("/");
    // })
// app.get("/123abcsecret",function(req,res){
// res.render("adminlogin"); 
// })
// app.get("/team",function(req,res){
//     res.render("create_team")
// })
// app.post("/team",function(req,res){
//     Team.create({ 
//         name:req.body.team.name,
//         designation:req.body.team.designation,
//         email:req.body.team.email,
//         linkedin:req.body.team.linkedin,
//         github:req.body.team.github,
//         number:req.body.team.number,
//         image:req.body.team.image,
//         type:req.body.team.type,
//     }) 
//     res.redirect("/");
// })
    
// app.get("/ateam",function(req,res){
//     Team.find({},function(err,teams){
//         if(err)
//         console.log("error");
//     else
//     {
//        res.render("ateam",{teams:teams})
//     }
// })
// })
// app.get("/tteam",function(req,res){
//     Team.find({},function(err,teams){
//         if(err)
//         console.log("error");
//     else
//     {
//        res.render("tteam",{teams:teams})
//     }
// })

// })
// app.get("/register_course",function(req,res){
//     res.render("register_course")
// })
// app.get("/intern",function(req,res){
//     res.render("intern");
// })
// app.post("/intern",function(req,res){
//     Intern.create({
//         name:req.body.intern.name,
//         email:req.body.intern.email,
//         phone:req.body.intern.phone,
//         college:req.body.intern.college,
//         branch:req.body.intern.branch,
//         course:req.body.intern.course,
//         venue:req.body.intern.venue,
//         referal:req.body.intern.referal
//     })
//     res.redirect("/");
// })
// app.get("/:id",function(req,res){
//     Team.findById(req.params.id,function(err,foundTeam){
//         if(err){
//             res.redirect("/");
//         }
//         else{
//             res.render("show",{team:foundTeam});
//         }
//     })

// })
// app.delete("/:id",function(req,res){
//     Team.findByIdAndRemove(req.params.id,function(err){
//         if(err){
//             res.redirect("/ateam")
//         }
//         else{
//             res.redirect("/")
//         }
//     })
// })
// app.get("/:id/edit",function(req,res){
//     Team.findById(req.params.id,function(err,foundTeam){
//         if(err){
//             console.log("Error");
//         }
//         else{
//             res.render("edit_team",{team:foundTeam})
//         }
//     })
// })    
// app.post("/:id",function(req,res){
//     Team.findByIdAndUpdate(req.params.id,req.body.team,function(err,updatedTeam){
//         if(err){
//             res.redirect("/");
//         }
//         else{
//             res.redirect("/"+req.params.id);
//         }
//     })
// })
app.use(staffRoutes);
app.listen("3000",function(){
    console.log("Server has started.");
});

