var express=require("express");
var router=express.Router();
var Slider=require("../models/slider");
var Sponsor=require("../models/sponsor");
var Member=require("../models/member")
var News=require("../models/news");
var Image=require("../models/image")
router.get("/adminhome",async(req,res,next)=>{
    var slider=[]
    var news=[]
    var sponsor=[]
    var image=[]
    var member=[]
    await Member.find({},function(err,members){
      if(err)
      console.log("err")
      else
      {
      for(var i=0;i<members.length;i++)
      {
   member.push(members[i])
      }}
     
    });
   await Slider.find({},function(err,sliders){
     if(err)
     console.log("err")
     else
     {
     for(var i=0;i<sliders.length;i++)
     {
  slider.push(sliders[i])
     }}
    
   });
   await News.find({},function(err,newss){
     if(err)
     console.log("err")
     else{
       for(var i=0;i<newss.length;i++)
     {
       news.push(newss[i])
     }
     }
  
   });
   await Sponsor.find({},function(err,sponsors){
    if(err)
    console.log("err")
    else
    {
    for(var i=0;i<sponsors.length;i++)
    {
  sponsor.push(sponsors[i])
    }}
  });
  await Image.find({},function(err,images){
    if(err)
    console.log("err")
    else
    {
    for(var i=0;i<images.length;i++)
    {
  image.push(images[i])
    }}
  });
   res.render("adminhome",{news:news,slider:slider,sponsor:sponsor,image:image,member:member});
  })
  router.post("/adminhome",function(req,res){
    Message.create({
      recep:req.body.message.recep,
      desc:req.body.message.desc
    })
    res.redirect("/adminhome")
  })
  module.exports=router;