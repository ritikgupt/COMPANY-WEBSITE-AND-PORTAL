var Request=require("../models/request");
var Request_staff=require("../models/request_staff");
var Detail=require("../models/detail");
var passport=require("passport");
var e=require("passport-local");
var express=require("express");
var router=express.Router();
var multer=require("multer");
var upload=multer({dest:'uploads/'});
var cloudinary =require("cloudinary");
cloudinary.config({
    cloud_name:'dzsms0nne',
    api_key:'542159551497727',
    api_secret: 'yRkiZK6Gf4eNNhXqvrNI9WHFKM0'
});
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
    console.log(req.file)
    cloudinary.v2.uploader.upload(req.file.path,{overwrite:true},function(err,result){
  Request.create(
    {
        desc:req.body.request.desc,
        recep:req.body.request.recep,
        stu_id:req.user.id,
        req_file:result.secure_url,
        date:Date.now()
    }
)})
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