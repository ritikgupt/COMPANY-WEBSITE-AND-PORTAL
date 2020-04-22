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
var pdf=require("pdf").pdf
var fs=require("fs")
var Slider=require("./models/slider");
var Sponsor=require("./models/sponsor");
var Member=require("./models/member")
var News=require("./models/news");
var Intern=require("./models/intern");
var Program=require("./models/program");
var Workshop=require("./models/workshop");
var multer=require("multer");
var storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'uploads/');
  },
  filename:function(req,file,cb){
    cb(null,new Date().toISOString()+file.originalname);
  }
});
// var filefilter=(req,file,cb)=>{
//   if(file.mimetype===)
// }
var upload=multer({storage:storage});
var app=a(); 
//body parser only parses url encoded bodies or json bodies
var Student=require("./models/student");
var Detail=require("./models/detail");
var Staff=require("./models/staff");
var Request=require("./models/request");
var Image=require("./models/image");
var Request_staff=require("./models/request_staff");
app.use(b.urlencoded({ extended: true }));
c.connect("mongodb://localhost:27017/amz", { useNewUrlParser: true,useFindAndModify : false,useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(a.static("public"));
app.use('/uploads',a.static("uploads"));
// app.use(a.static('uploads'));
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
app.get("/",async(req,res,next)=>{
  var slider=[]
  var news=[]
  var sponsor=[]
  var image=[]
  var member=[]
  await Member.find({},function(err,members){
    if(err)
    console.log("err")
    else
    {
    for(var i=0;i<members.length;i++)
    {
 member.push(members[i])
    }}
   
  });
 await Slider.find({},function(err,sliders){
   if(err)
   console.log("err")
   else
   {
   for(var i=0;i<sliders.length;i++)
   {
slider.push(sliders[i])
   }}
  
 });
 await News.find({},function(err,newss){
   if(err)
   console.log("err")
   else{
     for(var i=0;i<newss.length;i++)
   {
     news.push(newss[i])
   }
   }

 });
 await Sponsor.find({},function(err,sponsors){
  if(err)
  console.log("err")
  else
  {
  for(var i=0;i<sponsors.length;i++)
  {
sponsor.push(sponsors[i])
  }}
});
await Image.find({},function(err,images){
  if(err)
  console.log("err")
  else
  {
  for(var i=0;i<images.length;i++)
  {
image.push(images[i])
  }}
});
 res.render("amz",{news:news,slider:slider,sponsor:sponsor,image:image,member:member});
})
app.get("/newmember",function(req,res){
  res.render("newmember");
})
app.post("/newmember",upload.single('member[file]'),function(req,res){
  Member.create({
    file:req.file.path,
    name:req.body.member.name,
    designation:req.body.member.designation,
    linkedIn:req.body.member.linkedIn
  })
  res.redirect("/adminhome")
})
app.get("/newprogram",function(req,res){
  res.render("program");
})
app.post("/newprogram",function(req,res){
  Program.create({
    about:req.body.program.about,
    eligibility:req.body.program.eligibility,
    certificate:req.body.program.certificate,
    fee:req.body.program.fee,
    type:req.body.program.type,
  })
  res.redirect("/")
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  else
  res.redirect("/login");
}
app.get("/newnews",function(req,res){
  res.render("newnews");
})
app.post("/newnews",upload.single('news[file]'),function(req,res){
  News.create({
    title:req.body.news.title,
    file:req.file.path,
    desc:req.body.news.desc,
    time:Date.now()
  })
  res.redirect("/adminhome")
})
app.get("/image",function(req,res){
  res.render("image");
})
app.post("/image",upload.single('image[file]'),function(req,res){
  Image.create({
    file:req.file.path
  })
  res.redirect("/adminhome")
})
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
app.get("/dashboard",isLoggedIn,function(req,res){
  console.log(req.user);
  if(req.user.type=="Staff")
  res.render("staff",{currentStaff:req.user});
  else
  res.render("aspiring",{currentStudent:req.user});
})
app.post("/dashboard",upload.single('request[req_file]'),(req,res,next)=>{
  if(req.user.type=="Student")
  {
  Request.create(
    {
        desc:req.body.request.desc,
        recep:req.body.request.recep,
        stu_id:req.user.id,
        req_file:req.file.path,
        date:Date.now()
    }
)
  res.redirect("/dashboard")}
  else{
//     var doc=new pdf()
// doc.text(20,30,"This is the first page text")
// doc.text(20,40,"this is more text in the pdf on the first page")
// doc.addPage()
// doc.text(20,20,"This is the second page of the pdf document.") 
// doc.setProperties({
//   title:"Basic pdf file",
//   subject:"Expense Sheet",
//   creator:"Ritik Gupta",
//   keywords:"AMZ"
// })
// var filename="output.pdf"
// fs.writeFile(filename,doc.output('./uploads'),function(err,data){
//   console.log("Pdf file created");
// })
    // Request_staff.create({
    //   desc:req.body.request_staff.desc
    // })
// var doc=new pdfdocument();
// doc.pipe(fs.createWriteStream(Date.now()));
// doc.fontSize(25).text(req.body.)
res.redirect("/dashboard");
  }
})
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
})
app.get("/intern",function(req,res){
    res.render("intern");
})
app.post("/intern",function(req,res){
  Intern.create({
    name:req.body.intern.name,
    college:req.body.intern.college,
    phone:req.body.intern.phone,
    email:req.body.intern.email,
    branch:req.body.intern.branch,
    course:req.body.intern.course,
    venue:req.body.intern.venue,
    referal:req.body.intern.referal,
    internship:req.body.intern.internship,
  })
  res.redirect("/");
})
app.get("/online",function(req,res){
    res.render("online");
})
app.get("/offline",function(req,res){
    res.render("offline");
})
app.get("/newworkshop",function(req,res){
  res.render("newworkshop");
})
app.get("/workshop",async(req,res,next)=>{
  var workshop=[]
    await Workshop.find({},function(err,workshops){
    if(err)
    console.log(err)
    else{
for(i=0;i<workshops.length;i++){
  workshop.push(workshops[i])
}
    }
        
      })
      console.log(workshop)
      res.render("workshop",{workshop:workshop})
    }
)
app.post("/newworkshop",upload.single('workshop[file]'),function(req,res){
  Workshop.create({
    title:req.body.workshop.title,
    file:req.file.path,
    desc:req.body.workshop.desc,
    time:Date.now()
  })
  res.redirect("/workshop");
})
app.get("/newslider",function(req,res){
  res.render("newslider");
})
app.post("/newslider",upload.single('slider[file]'),function(req,res){
  Slider.create({
file:req.file.path
  })
  res.redirect("/");
})
app.get("/newsponsor",function(req,res){
  res.render("newsponsor");
})
app.post("/newsponsor",upload.single('sponsor[file]'),function(req,res){
  Sponsor.create({
file:req.file.path
  })
  res.redirect("/adminhome");
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
                res.redirect("/logout");

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
app.get("/adminhome",async(req,res,next)=>{
  var slider=[]
  var news=[]
  var sponsor=[]
  var image=[]
  var member=[]
  await Member.find({},function(err,members){
    if(err)
    console.log("err")
    else
    {
    for(var i=0;i<members.length;i++)
    {
 member.push(members[i])
    }}
   
  });
 await Slider.find({},function(err,sliders){
   if(err)
   console.log("err")
   else
   {
   for(var i=0;i<sliders.length;i++)
   {
slider.push(sliders[i])
   }}
  
 });
 await News.find({},function(err,newss){
   if(err)
   console.log("err")
   else{
     for(var i=0;i<newss.length;i++)
   {
     news.push(newss[i])
   }
   }

 });
 await Sponsor.find({},function(err,sponsors){
  if(err)
  console.log("err")
  else
  {
  for(var i=0;i<sponsors.length;i++)
  {
sponsor.push(sponsors[i])
  }}
});
await Image.find({},function(err,images){
  if(err)
  console.log("err")
  else
  {
  for(var i=0;i<images.length;i++)
  {
image.push(images[i])
  }}
});
 res.render("adminhome",{news:news,slider:slider,sponsor:sponsor,image:image,member:member});
})

app.listen("3000",function(){
    console.log("Server has started.");
});