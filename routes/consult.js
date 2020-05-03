var Request=require("../models/request");
var Detail=require("../models/detail");
var a=require("express");
var router=a.Router();
router.get("/startupconsult",async(req,res,next)=>{
    var request=[]
    await Request.find({},function(err,requests){
      if(err)
      console.log("err")
      else
     {for(var i=0;i<requests.length;i++){
       if(requests[i].recep=="StartupConsult")
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
    router.get("/startupconsult/:id/show",async(req,res,next)=>{
      var request=[]
      var detail=[]
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