var Workshop=require("../models/workshop");
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
router.get("/newworkshop",function(req,res){
    res.render("newworkshop");
  })
  router.get("/workshop",async(req,res,next)=>{
      await Workshop.find({},function(err,workshops){
      if(err)
      console.log(err)
      else{
        res.render("workshop",{workshops:workshops})
      }
          
        })
        
      }
  )
  router.post("/newworkshop",upload.single('workshop[file]'),function(req,res){
    cloudinary.v2.uploader.upload(req.file.path,{overwrite:true},function(err,result){
    Workshop.create({
      title:req.body.workshop.title,
      file:result.secure_url,
      desc:req.body.workshop.desc,
      time:Date.now()
    })
  })
    res.redirect("/workshop");
  })
  router.get("/editworkshop",function(req,res){
    Workshop.find({},function(err,workshops){
      if(err)
      console.log("err")
      else
      res.render("editworkshop",{workshops:workshops})
    })
  })
  router.get("/:id/editworkshop",function(req,res){
    Workshop.findById(req.params.id,function(err,foundWorkshop){
      if(err){
          res.redirect("/");
      }
      else{
          res.render("showworkshop",{workshop:foundWorkshop});
      }
  })
  })
  router.delete("/:id/editworkshop",function(req,res){
    Workshop.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/editworkshop")
        }
        else{
            res.redirect("/editworkshop")
        }
    })
  })
  router.get("/expense",function(req,res){
    Request_staff.find({},function(err,request_staffs){
      if(err)
      console.log(err)
      else
      {
      
      res.render("expense",{request_staffs:request_staffs});
    }})
  
  })
  router.get("/:id/changephotoworkshop",function(req,res){
    Workshop.findById(req.params.id,function(err,foundWorkshop){
        if(err){
            console.log("Error");
        }
        else{
            res.render("changephotoworkshop",{workshop:foundWorkshop})
        }
    }) 
  })
  router.post("/:id/changephotoworkshop",upload.single("workshop[file]",{overwrite:true}),function(req,res){
    cloudinary.v2.uploader.upload(req.file.path,{overwrite:true},function(err,result){
         Workshop.findByIdAndUpdate(req.params.id,{file:result.secure_url},function(err){
            if(err){
                res.redirect("/adminhome");
            }
            else{
                res.redirect("/editworkshop");
            }
          })
        })
    })
    router.get("/:id/editworkshopform",function(req,res){
      Workshop.findById(req.params.id,function(err,foundWorkshop){
        if(err){
          console.log("err")
        }
        else{
          res.render("editworkshopform",{workshop:foundWorkshop})
        }
      })
    })
    router.post("/:id/editworkshopform",function(req,res){
      Workshop.findByIdAndUpdate(req.params.id,req.body.workshop,function(err){
           if(err){
               res.redirect("/adminhome");
           }
           else{
               res.redirect("/editworkshop");
           }
       })
     })
     module.exports=router;