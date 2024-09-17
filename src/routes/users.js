var express = require('express');
var router = express.Router();
const { UserModel } = require('../models/user.model');
const { UserEntity } = require('../entities/user.entity');
const userModel = new UserModel();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* GET users listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');
});

module.exports = router;
