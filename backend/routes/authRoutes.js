const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      // Ensure role is only set to admin if explicitly allowed
      role: role === "admin" ? "admin" : "user"
    });
    await newUser.save();
    console.log("User registered successfully:", username);
    res.status(201).json("User registered");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: "Invalid user" });
  // Compare the hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Set token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true, // prevents access from client-side JavaScript
    secure: false, // true in production for HTTPS
    sameSite: "strict", // helps prevent CSRF
    maxAge: 3600000 // 1 hour in milliseconds
  });
  res.json({ token, message: "Login successful" });
});

module.exports = router;
