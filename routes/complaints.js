var Request=require("../models/request");
var Detail=require("../models/detail");
var a=require("express");
var async=require("async");
var router=a.Router();
var download=require("download")
var pdf=require("pdf");
router.get("/complaints",async(req,res,next)=>{
    var request=[]
    var detail=[]
    await Request.find({},function(err,requests){
      if(err)
      console.log("err")
      else
     {for(var i=0;i<requests.length;i++){
       if(requests[i].recep=="Complaints")
       request.push(requests[i])
     }
      }})
      await Detail.find({},function(err,details){
        if(err)
        console.log("err")
        else
        {
          res.render("patent",{details:details,request:request})
        }
      })
      
    })
    router.get("/complaints/:id/show",async(req,res,next)=>{
      var request=[]
      await Request.findById(req.params.id,function(err,foundRequest){
        if(err)
        console.log("err")
        else
        request.push(foundRequest)
        })
        await Detail.find({},function(err,details){
          if(err)
          console.log("err")
          else
          {
            res.render("requestshow",{details:details,request:request})
          }
        })
      
      })
      module.exports=router;