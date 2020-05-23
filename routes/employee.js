// prevents the use of undeclared variable
var a = require('express');
var router = a.Router();
var Detail = require('../models/detail');
router.get('/employee', async(req, res) => {
  Detail.find({}, async(err, details) => {
    if (err)
      console.log(err);
    else
      res.render('employee', {details: details});
  });

});

module.exports = router;
