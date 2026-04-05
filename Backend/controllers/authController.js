

import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// @desc    Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation Check (If this is missing, bcrypt crashes)
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    // Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env file");
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error); // This prints the error in your terminal
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// @desc    Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        token: generateToken(user._id, user.role),
        user: { id: user._id, name: user.name, role: user.role }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};