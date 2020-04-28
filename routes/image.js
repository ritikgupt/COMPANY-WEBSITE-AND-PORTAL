var Image=require("../models/image");
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
router.get("/image",function(req,res){
    res.render("image");
  })
  router.post("/image",upload.single('image[file]'),function(req,res){
    Image.create({
      file:req.file.path
    })
    res.redirect("/adminhome")
  })
  router.get("/editimage",function(req,res){
    Image.find({},function(err,images){
      if(err)
      console.log("err")
      else
      res.render("editimage",{images:images})
    })
  })
  router.delete("/:id/editimage",function(req,res){
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
  module.exports=router;