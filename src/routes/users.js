var express = require('express');
var router = express.Router();
// const { UserModel } = require('../models/user.model');

require('dotenv').config();

/* GET users listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');
});

module.exports = router;
