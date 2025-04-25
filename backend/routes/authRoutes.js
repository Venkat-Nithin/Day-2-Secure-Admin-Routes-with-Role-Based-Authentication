const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {      
  const { email, password, role } = req.body;

  // Issue: Password should be hashed before saving
  const hashedPassword = await bcrypt.hash(password,10)
  const newUser = new User({
    email,
    password:hashedPassword, // Not hashed(fixed)
    role,
  });

  try {
    await newUser.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.get("/", async (req, res) => {
  res.status(200).json({ message: 'Welcome to the authentication API!' });
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // fixed code 
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  //Generating JWT if password matches
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});
module.exports = router;