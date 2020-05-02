var a=require("express");
var router=a.Router();
var Message=require("../models/message");
var Detail=require("../models/detail");
router.get("/message/:id",async(req,res,next)=>{
    var message=[]
    var detail=[]
    await Message.find({},function(err,messages){
      if(err)
      console.log("err")
      else
      {
        for(var i=0;i<messages.length;i++)
        {
          message.push(messages[i])
        }
      }
    })
    req.params.id=req.user.id
     await Detail.findById(req.params.id,function(err,foundDetail){
        if(err)
        console.log("err")
        else
        detail.push(foundDetail)
      })
      console.log(detail)
    res.render("message",{message:message,detail:detail})
    })
    module.exports=router;