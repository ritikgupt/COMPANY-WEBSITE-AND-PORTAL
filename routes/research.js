var Request=require("../models/request");
var Detail=require("../models/detail");
var a=require("express");
var async=require("async");
var router=a.Router();
var download=require("download")
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
  router.get("/research",async(req,res)=>{
    var request=[]
    var detail1=[]
    var detail=[]
    await Request.find({},function(err,requests){
      if(err)
      console.log("err")
      else
     {for(var i=0;i<requests.length;i++){
       if(requests[i].recep=="Research")
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
      res.render("research",{detail:detail,request:request})
  })
  router.get("/research/:id/show",async(req,res,next)=>{
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
      router.get("/startupconsult",async(req,res,next)=>{
        var request=[]
        var detail=[]
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
              for(var i=0;i<details.length;i++)
              {
                detail.push(details[i])
              }
            }
          })
          res.render("startupconsult",{detail:detail,request:request})
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
            await Detail.findById(request[0].stu_id,function(err,foundDetail){
              if(err)
              console.log("err")
              else
              {
               detail.push(foundDetail)
              }
            })
            res.render("startupconsultshow",{detail:detail,request:request})
          })
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
                      for(var i=0;i<details.length;i++)
                      {
                        detail.push(details[i])
                      }
                    }
                  })
                  res.render("complaints",{detail:detail,request:request})
                })
                router.get("/complaints/:id/show",async(req,res,next)=>{
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
                    res.render("complaintshow",{detail:detail,request:request})
                  })
  module.exports=router;