// prevents the use of undeclared variable
var a = require('express');
var router = a.Router();
var Message = require('../models/message');
router.get('/message/:id', async(req, res, next) => {
  await Message.find({}, async(err, messages) => {
    if (err)
      console.log('err');
    else {
      console.log(req.user);
      res.status(200).render('message', {messages: messages, currentUser: req.user});
    }
  });
});
module.exports = router;
