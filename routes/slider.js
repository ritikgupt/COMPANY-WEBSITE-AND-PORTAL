var express=require("express");
var router=express.Router();
var Slider=require("../models/slider");
var multer=require("multer");
var upload=multer({dest:'uploads/'});
var cloudinary =require("cloudinary");
cloudinary.config({
    cloud_name:'dzsms0nne',
    api_key:'542159551497727',
    api_secret: 'yRkiZK6Gf4eNNhXqvrNI9WHFKM0'
});
router.get("/newslider",function(req,res){
    res.render("newslider");
  })
  router.post("/newslider",upload.single('slider[file]'),function(req,res){
    cloudinary.v2.uploader.upload(req.file.path,{overwrite:true},function(err,result){
    Slider.create({
  file:result.secure_url
    })
    res.redirect("/");
  })
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
        if(err){
            res.redirect("/editslider")
        }
        else{
            res.redirect("/editslider")
        }
    })
  })
  module.exports=router;