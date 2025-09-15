const user = require('../models/user');
const bcrypt = require('bcrypt');

// Controller to get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new user({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { emailPrimary, password } = req.body;
  try {
    const existingUser = await user.findOne({ emailPrimary });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', user: existingUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login', details: err.message });
  }
};
