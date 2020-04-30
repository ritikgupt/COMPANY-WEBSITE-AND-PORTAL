var Request=require("../models/request");
var Detail=require("../models/detail");
var a=require("express");
var async=require("async");
var router=a.Router();
var download=require("download-file")
var pdf=require("pdf");
router.get("/patent",async(req,res,next)=>{
    var request=[]
    var detail=[]
    await Request.find({},function(err,requests){
      if(err)
      console.log("err")
      else
     {for(var i=0;i<requests.length;i++){
       if(requests[i].recep=="Patent")
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
      res.render("patent",{detail:detail,request:request})
    })
    router.get("/patent/:id/show",async(req,res,next)=>{
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
        res.render("requestshow",{detail:detail,request:request})
      })
      router.get("/patent/:id/showpdf",async(req,res)=>{
        request=[]
        await Request.findById(req.params.id,function(err,foundRequest){
          if(err)
          console.log(err)
          else
          {
            console.log(foundRequest)
            request.push(foundRequest)
          }
        })
      var url ="www.google.com"
      console.log(url)
      var options={
        directory:"./views/",
        filename:"hdf.pdf"
      }
      download(url,options,function(err){
        if(err)
        console.log(err)
        else
        console.log("done");
      })
        res.send("file downloaded");
      })
      module.exports=router;