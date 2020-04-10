var a=require("express");
var b=require("body-parser");
var c=require("mongoose");
var f=require("method-override");
var g=require("express-sanitizer");
var passport=require("passport");
var e=require("passport-local");
var h=require("passport-local-mongoose");
var app=a(); 
// var User=require("./models/user");
app.use(b.urlencoded({ extended: true }));
c.connect("mongodb://localhost:27017/amz_data", { useNewUrlParser: true,useFindAndModify : false,useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(a.static("public"));
c.set('useCreateIndex', true);
app.use(g());
app.use(f("_method"));
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    //the above function will help to add currentUser variable to routes
    next();
    //without next() we won't be able to add currentUser to all the routes,it will add to one route and then stop
    //nothing will happen after that so to avoid this next() is used.
});
app.use(require("express-session")
({
  secret:"Let your work make the noise not your mouth.",
  resave:false,
  saveUninitialized:false  
}))
// app.get("/header",function(req,res){
//     res.render("header")
// })
app.get("/",function(req,res){
    res.render("amz");
})
app.get("/about",function(req,res){
    res.render("about");
})
app.get("/mechanical",function(req,res){
    res.render("mechanical");
})
app.get("/computer",function(req,res){
    res.render("computer");
})
app.get("/civil",function(req,res){
    res.render("civil");
})
app.get("/electrical",function(req,res){
    res.render("electrical");
})
app.get("/login",function(req,res){
    res.render("adminlogin");
})
app.get("/adminlogin",function(req,res){
    res.render("adminlogin");
})
app.get("/aspiring",function(req,res){
    res.render("aspiring");
})
app.get("/staff",function(req,res){
    res.render("staff");
})
app.get("/intern",function(req,res){
    res.render("intern");
})
app.get("/online",function(req,res){
    res.render("online");
})
app.get("/offline",function(req,res){
    res.render("offline");
})
app.get("/faculty",function(req,res){
    res.render("adminlogin");
})
app.get("/workshop",function(req,res){
    res.render("workshop");
})
// app.get("/123abcsecret",function(req,res){
// res.render("adminlogin"); 
// })
// app.get("/team",function(req,res){
//     res.render("create_team")
// })
// app.post("/team",function(req,res){
//     Team.create({ 
//         name:req.body.team.name,
//         designation:req.body.team.designation,
//         email:req.body.team.email,
//         linkedin:req.body.team.linkedin,
//         github:req.body.team.github,
//         number:req.body.team.number,
//         image:req.body.team.image,
//         type:req.body.team.type,
//     }) 
//     res.redirect("/");
// })pp.get("/aspiring",function(req,res){
    
// app.get("/ateam",function(req,res){
//     Team.find({},function(err,teams){
//         if(err)
//         console.log("error");
//     else
//     {
//        res.render("ateam",{teams:teams})
//     }
// })
// })
// app.get("/tteam",function(req,res){
//     Team.find({},function(err,teams){
//         if(err)
//         console.log("error");
//     else
//     {
//        res.render("tteam",{teams:teams})
//     }
// })

// })
// app.get("/register_course",function(req,res){
//     res.render("register_course")
// })
// app.get("/intern",function(req,res){
//     res.render("intern");
// })
// app.post("/intern",function(req,res){
//     Intern.create({
//         name:req.body.intern.name,
//         email:req.body.intern.email,
//         phone:req.body.intern.phone,
//         college:req.body.intern.college,
//         branch:req.body.intern.branch,
//         course:req.body.intern.course,
//         venue:req.body.intern.venue,
//         referal:req.body.intern.referal
//     })
//     res.redirect("/");
// })
// app.get("/:id",function(req,res){
//     Team.findById(req.params.id,function(err,foundTeam){
//         if(err){
//             res.redirect("/");
//         }
//         else{
//             res.render("show",{team:foundTeam});
//         }
//     })

// })
// app.delete("/:id",function(req,res){
//     Team.findByIdAndRemove(req.params.id,function(err){
//         if(err){
//             res.redirect("/ateam")
//         }
//         else{
//             res.redirect("/")
//         }
//     })
// })
// app.get("/:id/edit",function(req,res){
//     Team.findById(req.params.id,function(err,foundTeam){
//         if(err){
//             console.log("Error");
//         }
//         else{
//             res.render("edit_team",{team:foundTeam})
//         }
//     })
// })    
// app.post("/:id",function(req,res){
//     Team.findByIdAndUpdate(req.params.id,req.body.team,function(err,updatedTeam){
//         if(err){
//             res.redirect("/");
//         }
//         else{
//             res.redirect("/"+req.params.id);
//         }
//     })
// })
app.listen("3000",function(){
    console.log("Server has started.");
});

