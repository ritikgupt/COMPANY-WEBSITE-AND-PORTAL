
var passport=require("passport");
var e=require("passport-local");
var h=require("passport-local-mongoose");
var Detail=require("../models/detail");
var express=require("express");
var router=express.Router();
passport.use( new e(Detail.authenticate()));
passport.serializeUser(Detail.serializeUser());
passport.deserializeUser(Detail.deserializeUser());
var multer=require("multer");
var upload=multer({dest:'uploads/'});
var cloudinary =require("cloudinary");
cloudinary.config({
    cloud_name:'dzsms0nne',
    api_key:'542159551497727',
    api_secret: 'yRkiZK6Gf4eNNhXqvrNI9WHFKM0'
});
   router.get("/newuser",function(req,res){
    res.render("newuser");
  })
  router.post("/newuser",upload.single("detail[file]"),function(req,res){
    console.log(req.file)
    req.body.detail.name
    req.body.detail.username
    req.body.detail.password
    req.body.detail.email
    req.body.detail.mobile
    req.body.detail.dept
    req.body.detail.type
    req.body.detail.image
   
    req.body.detail.college
    cloudinary.v2.uploader.upload(req.file.path,{overwrite:true},function(err,result){
      console.log("Error:",err);
      console.log("Result:",result);
  Detail.register(new Detail({username:req.body.detail.username,name:req.body.detail.name,email:req.body.detail.email,mobile:req.body.detail.mobile,dept:req.body.detail.dept,
    type:req.body.detail.type,image:req.body.detail.image,file:result.secure_url,college:req.body.detail.college}),req.body.detail.password,function(err,detail){
      if(err)
      {
      console.log("err");
      return res.redirect("/newuser");
      }
      else{
        passport.authenticate("local")(req,res,function(){
          return res.redirect("/dashboard");
        })
      }
    })
  })
  res.redirect("/login");
  })
  router.get("/logout",function(req,res){
      req.logout();
      console.log(req.user)
      res.redirect("/login");
  })
  router.get("/:id/edituser",function(req,res){
    Detail.findById(req.params.id,function(err,foundDetail){
        if(err){
            console.log("Error");
        }
        else{
            res.render("edituser",{detail:foundDetail})
        }
    })
  })    
  
  
  router.post("/:id/changeuserphoto",upload.single("detail[file]",{overwrite:true}),function(req,res){
    console.log(req.file.path)
         Detail.findByIdAndUpdate({useFindAndModify:false},req.params.id,{file:req.file.path},function(err,updatedDetail){
            if(err){
                res.redirect("/adminhome");
            }
            else{
                res.redirect("/"+req.params.id+"/show");
            }
        })
    })
    router.post("/:id/edituser",function(req,res){
      console.log(req.body.detail)
      Detail.findByIdAndUpdate(req.params.id,req.body.detail,function(err,updatedDetail){
           if(err){
               res.redirect("/adminhome");
           }
           else{
               res.redirect("/"+req.params.id+"/show");
           }
       })
     })
     router.get("/:id/changeuserphoto",function(req,res){
       Detail.findById(req.params.id,function(err,foundDetail){
           if(err){
               console.log("Error");
           }
           else{
               res.render("changeuserphoto",{detail:foundDetail})
           }
       }) 
     })
        router.delete("/:id/",function(req,res){
          Detail.findByIdAndRemove(req.params.id,function(err){
              if(err){
                  res.redirect("/")
              }
              else{
                  res.redirect("/students")
              }
          })
        })
    module.exports=router;