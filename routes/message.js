var a=require("express");
var router=a.Router();
var Message=require("../models/message");
var Detail=require("../models/detail");
router.get("/message/:id",async(req,res,next)=>{
    await Message.find({},function(err,messages){
      if(err)
      console.log("err")
      else
      {
       console.log(req.user) 
    res.render("message",{messages:messages,currentUser:req.user})
      }})
    })
    module.exports=router;