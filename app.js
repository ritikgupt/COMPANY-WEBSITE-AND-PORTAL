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
var Message=require("./models/message");
var Slider=require("./models/slider");
var Sponsor=require("./models/sponsor");
var Member=require("./models/member")
var News=require("./models/news");
var Intern=require("./models/intern");
var Program=require("./models/program");
var Workshop=require("./models/workshop");
var homeRoutes=require("./routes/home");
var adminhomeRoutes=require("./routes/adminhome");

var multer=require("multer");
const fs = require('fs');
const download = require('download-file');
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
app.use(adminhomeRoutes);
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
  if(req.user.type=="Employee")
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
    Request_staff.create({
      desc:req.body.request_staff.desc,
      credit:req.body.request_staff.credit,
      purpose:req.body.request_staff.purpose,
      empid:req.user.id,
      date:req.body.request_staff.date
    })
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
  console.log(req.file)
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
app.post("/:id/edituser",function(req,res){
 console.log(req.body.detail)
 Detail.findByIdAndUpdate(req.params.id,req.body.detail,function(err,updatedDetail){
      if(err){
          res.redirect("/adminhome");
      }
      else{
          res.redirect("/"+req.params.id);
      }
  })
})
app.get("/:id/changeuserphoto",function(req,res){
  Detail.findById(req.params.id,function(err,foundDetail){
      if(err){
          console.log("Error");
      }
      else{
          res.render("changeuserphoto",{detail:foundDetail})
      }
  }) 
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
app.get("/newuser",function(req,res){
  res.render("newuser");
})
app.post("/newuser",upload.single("detail[file]"),function(req,res){
  console.log(req.file)
Detail.create({
  name:req.body.detail.name,
  username:req.body.detail.username,
  password:req.body.detail.password,
  email:req.body.detail.email,
  mobile:req.body.detail.mobile,
  dept:req.body.detail.dept,
  type:req.body.detail.type,
  image:req.body.detail.image,
  file:req.file.path,
  college:req.body.detail.college
})
res.redirect("/login");
})
app.get("/students",function(req,res){
  Detail.find({},function(err,details){
    if(err)
    console.log(err)
    else
    res.render("students",{details:details})
  })
  
})
app.get("/employee",function(req,res){
  Detail.find({},function(err,details){
    if(err)
    console.log(err)
    else
    res.render("employee",{details:details})
  })
  
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


app.get("/message/:id",async(req,res,next)=>{
var message=[]
var detail=[]
await Message.find({},function(err,messages){
  if(err)
  console.log("err")
  else
  {
    for(var i=0;i<messages.length;i++)
    {
      message.push(messages[i])
    }
  }
})
req.params.id=req.user.id
 await Detail.findById(req.params.id,function(err,foundDetail){
    if(err)
    console.log("err")
    else
    detail.push(foundDetail)
  })
res.render("message",{message:message,detail:detail})

})
app.get("/patent",async(req,res,next)=>{
  var request=[]
  var detail=[]
  await Request.find({},function(err,requests){
    if(err)
    console.log("err")
    else
   {for(var i=0;i<requests.length;i++){
     if(requests[i].recep=="Patent")
     request.push(requests[i])
   }
    }})
    await Detail.find({},function(err,details){
      if(err)
      console.log("err")
      else
      {
        for(var i=0;i<details.length;i++)
        {
          detail.push(details[i])
        }
      }
    })
    res.render("patent",{detail:detail,request:request})
  })
  app.get("/patent/:id/show",async(req,res,next)=>{
    var request=[]
    var detail=[]
    await Request.findById(req.params.id,function(err,foundRequest){
      if(err)
      console.log("err")
      else
      request.push(foundRequest)
      })
      await Detail.findById(request[0].stu_id,function(err,foundDetail){
        if(err)
        console.log("err")
        else
        {
         detail.push(foundDetail)
        }
      })
      res.render("patentshow",{detail:detail,request:request})
    })
    app.get("/patent/:id/showpdf",async(req,res)=>{
      request=[]
      await Request.findById(req.params.id,function(err,foundRequest){
        if(err)
        console.log(err)
        else
        {
          console.log(foundRequest)
          request.push(foundRequest)
        }
      })
    var url =""
    console.log(url)
    var options={
      directory:"./views/",
      filename:"hdf.pdf"
    }
    download(url,options,function(err){
      if(err) throw err
      console.log("done");
    })
      res.send("file downloaded");
    })
app.get("/research",async(req,res)=>{
  var request=[]
  var detail=[]
  await Request.find({},function(err,requests){
    if(err)
    console.log("err")
    else
   {for(var i=0;i<requests.length;i++){
     if(requests[i].recep=="Research")
     request.push(requests[i])
   }
    }})
    await Detail.find({},function(err,details){
      if(err)
      console.log()
      else
      {
        for(var i=0;i<details.length;i++)
        {
          detail.push(details[i])
        }
      }
    })
    res.render("research",{detail:detail,request:request})
})
app.get("/startupidea",async(req,res,next)=>{
  var request=[]
  var detail=[]
  await Request.find({},function(err,requests){
    if(err)
    console.log("err")
    else
   {for(var i=0;i<requests.length;i++){
     if(requests[i].recep=="StartupIdea")
     request.push(requests[i])
   }
    }})
    await Detail.find({},function(err,details){
      if(err)
      console.log()
      else
      {
        for(var i=0;i<details.length;i++)
        {
          detail.push(details[i])
        }
      }
    })
    res.render("startupidea",{detail:detail,request:request})
})
app.get("/startupconsult",async(req,res,next)=>{
  var request=[]
  var detail=[]
  await Request.find({},function(err,requests){
    if(err)
    console.log("err")
    else
   {for(var i=0;i<requests.length;i++){
     if(requests[i].recep=="StartupConsult")
     request.push(requests[i])
   }
    }})
    await Detail.find({},function(err,details){
      if(err)
      console.log()
      else
      {
        for(var i=0;i<details.length;i++)
        {
          detail.push(details[i])
        }
      }
    })
    res.render("startupconsult",{detail:detail,request:request})
})
app.get("/innovative",async(req,res)=>{
  var request=[]
  var detail=[]
  await Request.find({},function(err,requests){
    if(err)
    console.log("err")
    else
   {for(var i=0;i<requests.length;i++){
     if(requests[i].recep=="InnovativeIdea")
     request.push(requests[i])
   }
    }})
    await Detail.find({},function(err,details){
      if(err)
      console.log()
      else
      {
        for(var i=0;i<details.length;i++)
        {
          detail.push(details[i])
        }
      }
    })
    res.render("innovative",{detail:detail,request:request})
})
app.get("/complaints",async(req,res)=>{
  var request=[]
  var detail=[]
  await Request.find({},function(err,requests){
    if(err)
    console.log("err")
    else
   {for(var i=0;i<requests.length;i++){
     if(requests[i].recep=="Complaints")
     request.push(requests[i])
   }
    }})
    await Detail.find({},function(err,details){
      if(err)
      console.log()
      else
      {
        for(var i=0;i<details.length;i++)
        {
          detail.push(details[i])
        }
      }
    })
    res.render("complaints",{detail:detail,request:request})
})
app.get("/editslider",function(req,res){
  Slider.find({},function(err,sliders){
    if(err)
    console.log(err)
    else
    res.render("editslider",{sliders:sliders})
  })
})
app.delete("/:id/editslider",function(req,res){
  Slider.findByIdAndRemove(req.params.id,function(err){
    console.log(req.params.id);
      if(err){
          res.redirect("/editslider")
      }
      else{
          res.redirect("/editslider")
      }
  })
})
app.get("/editnews",function(req,res){
  News.find({},function(err,newss){
    if(err)
    console.log("err")
    else
    res.render("editnews",{newss:newss})
  })
})
app.get("/:id/editnews",function(req,res){
  News.findById(req.params.id,function(err,foundNews){
    console.log(req.params.id);
    if(err){
        res.redirect("/");
    }
    else{
        res.render("shownews",{news:foundNews});
    }
})
})
app.delete("/:id/editnews",function(req,res){
  News.findByIdAndRemove(req.params.id,function(err){
    console.log(req.params.id);
      if(err){
          res.redirect("/editnews")
      }
      else{
          res.redirect("/editnews")
      }
  })
})
app.get("/:id/changephotonews",function(req,res){
  News.findById(req.params.id,function(err,foundNews){
      if(err){
          console.log("Error");
      }
      else{
          res.render("changephotonews",{news:foundNews})
      }
  }) 
})
app.post("/:id/changephotonews",upload.single("news[file]",{overwrite:true}),function(req,res){
  console.log(req.file.path)
       News.findByIdAndUpdate(req.params.id,{file:req.file.path},function(err){
          if(err){
              res.redirect("/adminhome");
          }
          else{
              res.redirect("/editnews");
          }
      })
  })
  app.get("/:id/editnewsform",function(req,res){
    News.findById(req.params.id,function(err,foundNews){
      if(err){
        console.log("err")
      }
      else{
        res.render("editnewsform",{news:foundNews})
      }
    })
  })
  app.post("/:id/editnewsform",function(req,res){
    News.findByIdAndUpdate(req.params.id,req.body.news,function(err){
         if(err){
             res.redirect("/adminhome");
         }
         else{
             res.redirect("/editnews");
         }
     })
   })
app.get("/editsponsor",function(req,res){
  Sponsor.find({},function(err,sponsors){
    if(err)
    console.log("err")
    else
    res.render("editsponsor",{sponsors:sponsors})
  })
})
app.delete("/:id/editsponsor",function(req,res){
  Sponsor.findByIdAndRemove(req.params.id,function(err){
    console.log(req.params.id);
      if(err){
          res.redirect("/editsponsor")
      }
      else{
          res.redirect("/editsponsor")
      }
  })
})
app.get("/editimage",function(req,res){
  Image.find({},function(err,images){
    if(err)
    console.log("err")
    else
    res.render("editimage",{images:images})
  })
})
app.delete("/:id/editimage",function(req,res){
  Image.findByIdAndRemove(req.params.id,function(err){
    console.log(req.params.id);
      if(err){
          res.redirect("/editimage")
      }
      else{
          res.redirect("/editimage")
      }
  })
})
app.get("/editmember",function(req,res){
  Member.find({},function(err,members){
    if(err)
    console.log("err")
    else
    res.render("editmember",{members:members})
  })
})
app.get("/:id/editmember",function(req,res){
  Member.findById(req.params.id,function(err,foundMember){
    console.log(req.params.id);
    if(err){
        res.redirect("/");
    }
    else{
        res.render("showmember",{member:foundMember});
    }
})
})
app.delete("/:id/editmember",function(req,res){
  Member.findByIdAndRemove(req.params.id,function(err){
    console.log(req.params.id);
      if(err){
          res.redirect("/editmember")
      }
      else{
          res.redirect("/editmember")
      }
  })
})
app.get("/:id/changephotomember",function(req,res){
  Member.findById(req.params.id,function(err,foundMember){
      if(err){
          console.log("Error");
      }
      else{
          res.render("changephotomember",{member:foundMember})
      }
  }) 
})
app.post("/:id/changephotomember",upload.single("member[file]",{overwrite:true}),function(req,res){
  console.log(req.file.path)
       Member.findByIdAndUpdate(req.params.id,{file:req.file.path},function(err){
          if(err){
              res.redirect("/adminhome");
          }
          else{
              res.redirect("/editmember");
          }
      })
  })
  app.get("/:id/editmemberform",function(req,res){
    Member.findById(req.params.id,function(err,foundMember){
      if(err){
        console.log("err")
      }
      else{
        res.render("editmemberform",{member:foundMember})
      }
    })
  })
  app.post("/:id/editmemberform",function(req,res){
    Member.findByIdAndUpdate(req.params.id,req.body.member,function(err){
         if(err){
             res.redirect("/adminhome");
         }
         else{
             res.redirect("/editmember");
         }
     })
   })
app.get("/editworkshop",function(req,res){
  Workshop.find({},function(err,workshops){
    if(err)
    console.log("err")
    else
    res.render("editworkshop",{workshops:workshops})
  })
})
app.get("/:id/editworkshop",function(req,res){
  Workshop.findById(req.params.id,function(err,foundWorkshop){
    console.log(req.params.id);
    if(err){
        res.redirect("/");
    }
    else{
        res.render("showworkshop",{workshop:foundWorkshop});
    }
})
})
app.delete("/:id/editworkshop",function(req,res){
  Workshop.findByIdAndRemove(req.params.id,function(err){
    console.log(req.params.id);
      if(err){
          res.redirect("/editworkshop")
      }
      else{
          res.redirect("/editworkshop")
      }
  })
})
app.get("/expense",function(req,res){
  Request_staff.find({},function(err,request_staffs){
    if(err)
    console.log(err)
    else
    {
console.log(request_staffs)
    
    res.render("expense",{request_staffs:request_staffs});
  }})

})
app.get("/:id/changephotoworkshop",function(req,res){
  Workshop.findById(req.params.id,function(err,foundWorkshop){
      if(err){
          console.log("Error");
      }
      else{
          res.render("changephotoworkshop",{workshop:foundWorkshop})
      }
  }) 
})
app.post("/:id/changephotoworkshop",upload.single("workshop[file]",{overwrite:true}),function(req,res){
  console.log(req.file.path)
       Workshop.findByIdAndUpdate(req.params.id,{file:req.file.path},function(err){
          if(err){
              res.redirect("/adminhome");
          }
          else{
              res.redirect("/editworkshop");
          }
      })
  })
  app.get("/:id/editworkshopform",function(req,res){
    Workshop.findById(req.params.id,function(err,foundWorkshop){
      if(err){
        console.log("err")
      }
      else{
        res.render("editworkshopform",{workshop:foundWorkshop})
      }
    })
  })
  app.post("/:id/editworkshopform",function(req,res){
    Workshop.findByIdAndUpdate(req.params.id,req.body.workshop,function(err){
         if(err){
             res.redirect("/adminhome");
         }
         else{
             res.redirect("/editworkshop");
         }
     })
   })
app.get("/:id/",async(req,res)=>{
request=[]
detail=[]

 await  Detail.findById(req.params.id,function(err,foundDetail){
      if(err){
          res.redirect("/");
      }
      else{
          detail.push(foundDetail)
      }
  })
  var a=detail[0].id
  await Request_staff.find({},function(err,request_staffs){
    if(err)
    console.log(err)
    else
    {
  for(var i=0;i<request_staffs.length;i++)
  {
    if(request_staffs[i].empid==a)
    {
    request.push(request_staffs[i])
    }
  }
  }})
  res.render("show",{detail:detail,request:request})
})

app.get("/:id/edituser",function(req,res){
  Detail.findById(req.params.id,function(err,foundDetail){
      if(err){
          console.log("Error");
      }
      else{
          res.render("edituser",{detail:foundDetail})
      }
  })
})    
app.delete("/:id/",function(req,res){
  Detail.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/")
      }
      else{
          res.redirect("/students")
      }
  })
})

app.post("/:id/changeuserphoto",upload.single("detail[file]",{overwrite:true}),function(req,res){
  console.log(req.file.path)
       Detail.findByIdAndUpdate(req.params.id,{file:req.file.path},function(err,updatedDetail){
          if(err){
              res.redirect("/adminhome");
          }
          else{
              res.redirect("/"+req.params.id);
          }
      })
  })
app.use(homeRoutes);

app.listen("3000",function(){
    console.log("Server has started.");
});