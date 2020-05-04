var Request=require("../models/request");
var Detail=require("../models/detail");
var a=require("express");
var async=require("async");
var router=a.Router();
const https = require('https');
const fs = require('fs');
var download=require("download-file")
var pdf=require("pdf");
router.get("/patent",async(req,res,next)=>{
    var request=[]
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
          res.render("patent",{details:details,request:request})
        }
      })
    })
    router.get("/patent/:id/show",async(req,res,next)=>{
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
            console.log(request)
            console.log(details)
           res.render("requestshow",{request:request,details:details})
          }
        })
      })
      router.get("/patent/:id/showpdf",async(req,res)=>{
        request=[]
        await Request.findById(req.params.id,function(err,foundRequest){
          if(err)
          console.log(err)
          else
          {
           
            request.push(foundRequest)
          }
        })
      console.log(request[0].req_file);
      var url =request[0].req_file
      console.log(url)

      const file = fs.createWriteStream("file.pdf");
      const s = https.get(url, function(response) {
        response.pipe(file);
      });   
      res.send("file downloaded");
       
      })
      module.exports=router;