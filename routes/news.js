var News=require("../models/news");
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
router.get("/newnews",function(req,res){
    res.render("newnews");
  })
  router.post("/newnews",upload.single('news[file]'),function(req,res){
    cloudinary.v2.uploader.upload(req.file.path,{overwrite:true},function(err,result){
    News.create({
      title:req.body.news.title,
      file:result.secure_url,
      desc:req.body.news.desc,
      time:Date.now()
    })
  })
    res.redirect("/adminhome")
  })
  router.get("/editnews",function(req,res){
    News.find({},function(err,newss){
      if(err)
      console.log("err")
      else
      res.render("editnews",{newss:newss})
    })
  })
  router.get("/:id/editnews",function(req,res){
    News.findById(req.params.id,function(err,foundNews){
     
      if(err){
          res.redirect("/");
      }
      else{
          res.render("shownews",{news:foundNews});
      }
  })
  })
  router.delete("/:id/editnews",function(req,res){
    News.findByIdAndRemove(req.params.id,function(err){
      
        if(err){
            res.redirect("/editnews")
        }
        else{
            res.redirect("/editnews")
        }
    })
  })
  router.get("/:id/changephotonews",function(req,res){
    News.findById(req.params.id,function(err,foundNews){
        if(err){
            console.log("Error");
        }
        else{
            res.render("changephotonews",{news:foundNews})
        }
    }) 
  })
  router.post("/:id/changephotonews",upload.single("news[file]",{overwrite:true}),function(req,res){
    cloudinary.v2.uploader.upload(req.file.path,{overwrite:true},function(err,result){
         News.findByIdAndUpdate(req.params.id,{file:result.secure_url},function(err){
            if(err){
                res.redirect("/adminhome");
            }
            else{
                res.redirect("/editnews");
            }
        })
      })
    })
    router.get("/:id/editnewsform",function(req,res){
      News.findById(req.params.id,function(err,foundNews){
        if(err){
          console.log("err")
        }
        else{
          res.render("editnewsform",{news:foundNews})
        }
      })
    })
    router.post("/:id/editnewsform",function(req,res){
      News.findByIdAndUpdate(req.params.id,req.body.news,function(err){
           if(err){
               res.redirect("/adminhome");
           }
           else{
               res.redirect("/editnews");
           }
       })
     })
     module.exports=router;