var Request=require("../models/request");
var Detail=require("../models/detail");
var a=require("express");
var router=a.Router();
router.get("/innovative",async(req,res,next)=>{
    var request=[]
    var detail=[]
    await Request.find({},function(err,requests){
      if(err)
      console.log("err")
      else
     {for(var i=0;i<requests.length;i++){
       if(requests[i].recep=="InnovativeIdea")
       request.push(requests[i])
     }
      }})
      await Detail.find({},function(err,details){
        if(err)
        console.log("err")
        else
        {
          for(var i=0;i<details.length;i++)
          {
            detail.push(details[i])
          }
        }
      })
      res.render("innovative",{detail:detail,request:request})
    })
    router.get("/innovative/:id/show",async(req,res,next)=>{
      var request=[]
      var detail=[]
      await Request.findById(req.params.id,function(err,foundRequest){
        if(err)
        console.log("err")
        else
        request.push(foundRequest)
        })
        await Detail.findById(request[0].stu_id,function(err,foundDetail){
          if(err)
          console.log("err")
          else
          {
           detail.push(foundDetail)
          }
        })
        res.render("innovativeshow",{detail:detail,request:request})
      })
      module.exports=router;