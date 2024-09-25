var express = require('express');
var router = express.Router();
const { UserModel } = require('../models/user.model');
const userModel = new UserModel();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
require('dotenv').config();

router.get('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, teacherid } = req.body;
    const user = await userModel.getUserByEmail(email);
    if (user) {
      return res
        .status(403)
        .json({ error: 'User with that email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(email, hashedPassword, teacherid);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
