var a=require("express");
var router=a.Router();
var Detail=require("../models/detail");
router.get("/employee",function(req,res){
    Detail.find({},function(err,details){
      if(err)
      console.log(err)
      else
      res.render("employee",{details:details})
    })
    
  })
  
  module.exports=router;