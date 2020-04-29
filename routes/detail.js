var Detail=require("../models/detail");
var passport=require("passport");
var e=require("passport-local");
var express=require("express");
var router=express.Router();
passport.use( new e(Detail.authenticate()));
passport.serializeUser(Detail.serializeUser());
passport.deserializeUser(Detail.deserializeUser());
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
router.post("/:id/edituser",function(req,res){
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
   router.get("/newuser",function(req,res){
    res.render("newuser");
  })
  router.post("/newuser",upload.single("detail[file]"),function(req,res){
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
  
  router.post("/:id/changeuserphoto",upload.single("detail[file]",{overwrite:true}),function(req,res){
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
    router.get("/:id/",async(req,res)=>{
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
    module.exports=router;