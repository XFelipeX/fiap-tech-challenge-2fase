var express = require('express');
var router = express.Router();
const { UserModel } = require('../models/user.model');
const userModel = new UserModel();
const { responseMiddleware } = require('../middlewares/responseMiddleware');


require('dotenv').config();

router.get(
  '/',
  async function (req, res, next) {
    const usersList = await userModel.getUsers();
    req.customData = { title: 'Usuários', users: usersList };
    next();
  },
  responseMiddleware,
);

module.exports = router;
