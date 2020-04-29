var a=require("express");
var router=a.Router();
var Detail=require("../models/detail");
router.get("/students",function(req,res){
    Detail.find({},function(err,details){
      if(err)
      console.log(err)
      else
      res.render("students",{details:details})
    })
    
  })
  
  module.exports=router