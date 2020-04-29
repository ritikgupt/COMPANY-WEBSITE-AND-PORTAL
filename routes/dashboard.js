var Request=require("../models/request");
var Request_staff=require("../models/request_staff");
var Detail=require("../models/detail");
var passport=require("passport");
var e=require("passport-local");
var express=require("express");
var router=express.Router();
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
passport.use( new e(Detail.authenticate()));
passport.serializeUser(Detail.serializeUser());
passport.deserializeUser(Detail.deserializeUser());
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else
    res.redirect("/login");
  }
  
router.get("/login",function(req,res){
    res.render("login");
})
router.post("/login",passport.authenticate("local",{
  successRedirect:"/dashboard",
  failureRedirect:"/login"
}))
router.get("/dashboard",isLoggedIn,function(req,res){
  console.log(req.user);
  if(req.user.type=="Employee")
  res.render("staff",{currentStaff:req.user});
  else
  res.render("aspiring",{currentStudent:req.user});
})
router.post("/dashboard",upload.single('request[req_file]'),(req,res,next)=>{
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

module.exports=router;