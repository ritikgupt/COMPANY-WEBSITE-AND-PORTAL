var a=require("express");
var b=require("body-parser");
var c=require("mongoose");
var f=require("method-override");
var g=require("express-sanitizer");
var passport=require("passport");
var e=require("passport-local");
var Program=require("./models/program");
var workshopRoutes=require("./routes/workshop");
var homeRoutes=require("./routes/home");
var adminhomeRoutes=require("./routes/adminhome");
var sliderRoutes=require("./routes/slider");
var newsRoutes=require("./routes/news");
var sponsorRoutes=require("./routes/sponsor");
var memberRoutes=require("./routes/advisory");
var imageRoutes=require("./routes/image");
var forgotRoutes=require("./routes/forgotpassword");
var researchRoutes=require("./routes/research");
var patentRoutes=require("./routes/patent");
var complaintRoutes=require("./routes/complaints");
var startupRoutes=require("./routes/startup");
var consultRoutes=require("./routes/consult");
var innovativeRoutes=require("./routes/innovative");
var messageRoutes=require("./routes/message");
var internRoutes=require("./routes/intern");
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
app.use(b.urlencoded({ extended: true }));
var Detail=require("./models/detail");
var Request=require("./models/request");
var Request_staff=require("./models/request_staff");
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
app.use(adminhomeRoutes);
app.use(sliderRoutes);
app.use(newsRoutes);
app.use(sponsorRoutes);
app.use(memberRoutes);
app.use(imageRoutes);
app.use(workshopRoutes)
app.use(forgotRoutes);
app.use(researchRoutes);
app.use(patentRoutes);
app.use(complaintRoutes);
app.use(startupRoutes);
app.use(consultRoutes);
app.use(innovativeRoutes);
app.use(messageRoutes);
app.use(internRoutes)
//body parser only parses url encoded bodies or json bodies
// app.get("/header",function(req,res){
//     res.render("header")
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

app.get("/online",function(req,res){
    res.render("online");
})
app.get("/offline",function(req,res){
    res.render("offline");
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

app.get("/logout",function(req,res){
    req.logout();
    console.log(req.user)
    res.redirect("/login");
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