var a=require("express");
var router=a.Router();
var Detail=require("../models/detail");
var Request_staff=require("../models/request_staff")
router.get("/students",function(req,res){
    Detail.find({},function(err,details){
      if(err)
      console.log(err)
      else
      res.render("students",{details:details})
    })
    
  })
  router.get("/:id/show",async(req,res)=>{
    request=[]
      await Request_staff.find({},function(err,request_staffs){
        if(err)
        console.log(err)
        else
        {
      for(var i=0;i<request_staffs.length;i++)
      {
        if(request_staffs[i].empid==req.params.id)
        {
        request.push(request_staffs[i])
        }
      }
      }})
      await  Detail.findById(req.params.id,function(err,foundDetail){
        if(err){
            res.redirect("/");
        }
        else{
          res.render("show",{detail:foundDetail,request:request})
        }
    })
      
    })
  
  module.exports=router