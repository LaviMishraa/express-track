const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2. Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 4. Create user
    await User.create({ name, email, password: hashed });

    return res.status(201).json({ message: "User registered successfully" });

  } catch (e) {
  console.error("REGISTER ERROR FULL:", e);
  console.error("ERROR NAME:", e.name);
  console.error("ERROR MESSAGE:", e.message);
  console.error("ERROR CODE:", e.code);

  if (e.code === 11000) {
    return res.status(409).json({ message: "User already exists" });
  }

  return res.status(500).json({ message: "Server error" });
}
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    res.status(500).json({ message: "Server error" });
  }
};