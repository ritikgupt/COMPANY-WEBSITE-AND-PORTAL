
var a = require('express');
var router = a.Router();
var Detail = require('../models/detail');
var Request_staff = require('../models/request_staff');
router.get('/students', async(req, res) => {
  Detail.find({}, async(err, details) => {
    if (err)
      console.log(err);
    else
      res.status(200).render('students', {details: details});
  });

});
router.get('/:id/show', async(req, res) => {
  var request = [];
  await Request_staff.find({}, async(err, request_staffs) => {
    if (err)
      console.log(err);
    else {
      for (var i = 0; i < request_staffs.length; i++) {
        if (request_staffs[i].empid === req.params.id) {
          request.push(request_staffs[i]);
        }
      }
    }
  });
  await Detail.findById(req.params.id, async(err, foundDetail) => {
    if (err){
      res.redirect('/');
    } else {
      res.status(200).render('show', {detail: foundDetail, request: request});
    }
  });

});

module.exports = router;
