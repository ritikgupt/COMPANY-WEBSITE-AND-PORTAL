var express=require("express");
var router=express.Router();
var Slider=require("../models/slider");
var multer=require("multer");
const download = require('download-file');
var storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'uploads/');
  },
  filename:function(req,file,cb){
    cb(null,new Date().toISOString()+file.originalname);
  }
});
var upload=multer({storage:storage});
router.get("/newslider",function(req,res){
    res.render("newslider");
  })
  router.post("/newslider",upload.single('slider[file]'),function(req,res){
    Slider.create({
  file:req.file.path
    })
    res.redirect("/");
  })
  router.get("/editslider",function(req,res){
    Slider.find({},function(err,sliders){
      if(err)
      console.log(err)
      else
      res.render("editslider",{sliders:sliders})
    })
  })
  router.delete("/:id/editslider",function(req,res){
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
  module.exports=router;