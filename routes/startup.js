var Request=require("../models/request");
var Detail=require("../models/detail");
var a=require("express");
var router=a.Router();
router.get("/startupidea",async(req,res)=>{
    var request=[]
    var detail1=[]
    var detail=[]
    await Request.find({},function(err,requests){
      if(err)
      console.log("err")
      else
     {for(var i=0;i<requests.length;i++){
       if(requests[i].recep=="StartupIdea")
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
            detail1.push(details[i])
          }
        }
      })
      console.log(detail1)
      for(var i=0;i<request.length;i++){
    for(var j=0;j<detail1.length;j++){
        if(detail1[j].id==request[i].stu_id)
        {   console.log("hello")
            detail.push(detail1[j])
        }
    }
      }
      res.render("startupidea",{detail:detail,request:request})
  })
  router.get("/startupidea/:id/show",async(req,res,next)=>{
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
      res.render("startupideashow",{detail:detail,request:request})
    })
    module.exports=router;