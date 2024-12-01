var express = require('express');
var router = express.Router();
const { UserModel } = require('../models/user.model');
const userModel = new UserModel();
const verifyToken = require('../middlewares/authMiddleware');
const { responseMiddleware } = require('../middlewares/responseMiddleware');


require('dotenv').config();

router.get(
  '/',
  verifyToken,
  async function (req, res, next) {
    const usersList = await userModel.getUsers();
    req.customData = { title: 'Usuários', users: usersList };
    next();
  },
  responseMiddleware,
);

router.delete(
  '/:id',
  verifyToken,
  async function (req, res, next) {
    const id = parseInt(req.params.id);

    const user = await userModel.getUser(id);

    if (!user) return res.status(404).send({ error: 'user not found.' });

    const result = await userModel.deleteUser(user.id);
    res.customData = result;
    res.status(204);

    next();
  },
  responseMiddleware,
);

module.exports = router;
