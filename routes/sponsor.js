var News=require("../models/news");
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
  var upload=multer({storage:storage});

var Sponsor=require("../models/sponsor");
router.get("/newsponsor",function(req,res){
    res.render("newsponsor");
  })
  router.post("/newsponsor",upload.single('sponsor[file]'),function(req,res){
    Sponsor.create({
  file:req.file.path
    })
    res.redirect("/adminhome");
  })
  router.get("/editsponsor",function(req,res){
    Sponsor.find({},function(err,sponsors){
      if(err)
      console.log("err")
      else
      res.render("editsponsor",{sponsors:sponsors})
    })
  })
  router.delete("/:id/editsponsor",function(req,res){
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
  module.exports=router;