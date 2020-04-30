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
    detail=[]
     await  Detail.findById(req.params.id,function(err,foundDetail){
          if(err){
              res.redirect("/");
          }
          else{
              detail.push(foundDetail)
          }
      })
      var a=detail[0].id
      await Request_staff.find({},function(err,request_staffs){
        if(err)
        console.log(err)
        else
        {
      for(var i=0;i<request_staffs.length;i++)
      {
        if(request_staffs[i].empid==a)
        {
        request.push(request_staffs[i])
        }
      }
      }})
      res.render("show",{detail:detail,request:request})
    })
  
  module.exports=router