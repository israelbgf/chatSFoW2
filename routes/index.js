var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
      title: 'chatSFoW2',
      serverAddress: req.socket.address().address
  });
});

module.exports = router;
