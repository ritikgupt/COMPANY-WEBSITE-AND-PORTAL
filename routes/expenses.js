var Request_staff = require('../models/request_staff');
var express = require('express');
var router = express.Router();
router.get('/expenses', (req, res) => {
  Request_staff.find({}, (err, request_staffs) => {
    if (err) {
      console.log('err');
    } else {
      res.status(200).render('expenses', {user: req.user, request_staffs: request_staffs});
    }
  });
}
);
router.get('/:id/edit', (req, res) => {
  Request_staff.findById(req.params.id, (err, foundRequest_staff) => {
    if (err){
      console.log('err');
    } else {
      res.status(200).render('editexpense', {request: foundRequest_staff});
    }
  });
});
router.post('/:id/edit', (req, res) => {
  Request_staff.findByIdAndUpdate(req.params.id, req.body.request_staff, (err, request) => {
    if (err){
      console.log('err');
    } else {
      res.redirect('/expenses');
    }
  });
});
router.post('/:id/request_staff', (req, res) => {
  Request_staff.deleteMany({empid: {$in: [req.params.id]}}, (err, request_staffs) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/employee');
    }
  });
});
module.exports = router;
