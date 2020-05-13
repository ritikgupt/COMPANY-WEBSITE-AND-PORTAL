var compression = require('compression');
var createError = require('http-errors');
var a = require('express');
var b = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
require('dotenv').config();
var app = a();
app.set('view engine', 'ejs');
app.use(a.static('public'));
app.use('/uploads', a.static('uploads'));
app.use(b.urlencoded({ extended: true }));
app.use(compression());
var winston = require('./config/winston');
app.use(morgan('combined', { stream: winston.stream }));
var Detail = require('./models/detail');
var uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
var connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});
var f = require('method-override');
var g = require('express-sanitizer');
var passport = require('passport');
var E = require('passport-local');
var Program = require('./models/program');
var workshopRoutes = require('./routes/workshop');
var homeRoutes = require('./routes/home');
var adminhomeRoutes = require('./routes/adminhome');
var sliderRoutes = require('./routes/slider');
var newsRoutes = require('./routes/news');
var sponsorRoutes = require('./routes/sponsor');
var memberRoutes = require('./routes/advisory');
var imageRoutes = require('./routes/image');
var forgotRoutes = require('./routes/forgotpassword');
var researchRoutes = require('./routes/research');
var patentRoutes = require('./routes/patent');
var complaintRoutes = require('./routes/complaints');
var startupRoutes = require('./routes/startup');
var consultRoutes = require('./routes/consult');
var innovativeRoutes = require('./routes/innovative');
var messageRoutes = require('./routes/message');
var internRoutes = require('./routes/intern');
var detailRoutes = require('./routes/detail');
var employeeRoutes = require('./routes/employee');
var studentRoutes = require('./routes/student');
var dashboardRoutes = require('./routes/dashboard');
var certificateRoutes = require('./routes/certificate');
var verifyRoutes = require('./routes/verify');
var expensesRoutes = require('./routes/expenses');
var cors = require('cors');
// app.use(a.static('uploads'));
mongoose.set('useCreateIndex', true);
app.use(g());
app.use(cors({

  credentials: true,
}));
app.use(f('_method'));
app.use(require('cookie-session')({
  secret: 'Let your work make the noise not your mouth.',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new E(Detail.authenticate()));
passport.serializeUser(Detail.serializeUser());
passport.deserializeUser(Detail.deserializeUser());
app.use(adminhomeRoutes);
app.use(sliderRoutes);
app.use(newsRoutes);
app.use(sponsorRoutes);
app.use(memberRoutes);
app.use(imageRoutes);
app.use(workshopRoutes);
app.use(forgotRoutes);
app.use(researchRoutes);
app.use(patentRoutes);
app.use(complaintRoutes);
app.use(startupRoutes);
app.use(consultRoutes);
app.use(innovativeRoutes);
app.use(messageRoutes);
app.use(internRoutes);
app.use(dashboardRoutes);
app.use(employeeRoutes);
app.use(studentRoutes);
app.use(certificateRoutes);
app.use(verifyRoutes);
app.use(expensesRoutes);
app.get('/about', function(req, res){
  res.render('about');
});
app.get('/mechanical', function(req, res){
  res.render('mechanical');
});
app.get('/computer', function(req, res){
  res.render('computer');
});
app.get('/civil', function(req, res){
  res.render('civil');
});
app.get('/electrical', function(req, res){
  res.render('electrical');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
app.get('/online', function(req, res){
  const animal = 'alligator';
  // Send a text/html file back with the word 'alligator' repeated 1000 times
  res.send(animal.repeat(1000));
});
app.get('/offline', function(req, res){
  res.render('offline');
});
app.get('/newprogram', function(req, res){
  res.render('program');
});
app.post('/newprogram', function(req, res){
  Program.create({
    about: req.body.program.about,
    eligibility: req.body.program.eligibility,
    certificate: req.body.program.certificate,
    fee: req.body.program.fee,
    type: req.body.program.type,
  });
  res.redirect('/');
});
app.use(homeRoutes);
app.use(detailRoutes);
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error', {err: err});
});
app.listen(port, function(){
  console.log('Server has started.');
});
