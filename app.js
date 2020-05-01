var a=require("express");
var b=require("body-parser");
var mongoose=require("mongoose");
require('dotenv').config();
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
var detailRoutes=require("./routes/detail");
var employeeRoutes=require("./routes/employee");
var studentRoutes=require("./routes/student");
var dashboardRoutes=require("./routes/dashboard");
var app=a(); 

app.use(b.urlencoded({ extended: true }));
var Detail=require("./models/detail");
var Request_staff=require("./models/request_staff");
var uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true ,useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
app.set("view engine","ejs");
app.use(a.static("public"));
app.use('/uploads',a.static("uploads"));
// app.use(a.static('uploads'));
mongoose.set('useCreateIndex', true);
app.use(g());
app.use(f("_method"));
app.use(require("cookie-session")
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
app.use(dashboardRoutes);
app.use(employeeRoutes);
app.use(studentRoutes);
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
app.use(homeRoutes);
app.use(detailRoutes);
app.listen("3000",function(){
    console.log("Server has started.");
});