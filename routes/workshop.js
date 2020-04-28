var Workshop=require("../models/workshop");
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
router.get("/newworkshop",function(req,res){
    res.render("newworkshop");
  })
  router.get("/workshop",async(req,res,next)=>{
    var workshop=[]
      await Workshop.find({},function(err,workshops){
      if(err)
      console.log(err)
      else{
  for(i=0;i<workshops.length;i++){
    workshop.push(workshops[i])
  }
      }
          
        })
        console.log(workshop)
        res.render("workshop",{workshop:workshop})
      }
  )
  router.post("/newworkshop",upload.single('workshop[file]'),function(req,res){
    console.log(req.file)
    Workshop.create({
      title:req.body.workshop.title,
      file:req.file.path,
      desc:req.body.workshop.desc,
      time:Date.now()
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
      console.log(req.params.id);
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
      console.log(req.params.id);
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
  console.log(request_staffs)
      
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
    console.log(req.file.path)
         Workshop.findByIdAndUpdate(req.params.id,{file:req.file.path},function(err){
            if(err){
                res.redirect("/adminhome");
            }
            else{
                res.redirect("/editworkshop");
            }
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