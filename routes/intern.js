// prevents the use of undeclared variable
var Intern = require('../models/intern');
var a = require('express');
var router = a.Router();
router.get('/intern', async(req, res) => {
  res.status(200).render('intern');
});
router.post('/intern', async(req, res) => {
  Intern.create({
    name: req.body.intern.name,
    college: req.body.intern.college,
    phone: req.body.intern.phone,
    email: req.body.intern.email,
    branch: req.body.intern.branch,
    course: req.body.intern.course,
    venue: req.body.intern.venue,
    referal: req.body.intern.referal,
    internship: req.body.intern.internship,
  });
  res.redirect('/');
});
module.exports = router;
