var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
      title: 'chatSFoW2',
      serverAddress: req.socket.address().address
  });
});

module.exports = router;
