const user = require('../models/user');
const bcrypt = require('bcrypt');
const mail = require('./sendMail');

// Controller to get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await user.find({ "_id": req.query.id });
    // if (!users[0]) {
    //   return res.status(404).json({ error: 'User not found' });
    // }
    const userObj = users[0].toObject();
    delete userObj.password;
    delete userObj.__v;
    res.status(200).json(userObj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new user({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();
    const userObj = savedUser.toObject();
    delete userObj.password;
    delete userObj.__v;

    mail.sendMailWithHtmlFile({
      recipients: [{ email: userObj.emailPrimary }],
      subject: 'Welcome to Blue Ocean Pickup!',
      text: `Hello ${userObj.firstName},\n\nThank you for signing up for Blue Ocean Pickup! We're excited to have you on board.\n\nBest regards,\nBlue Ocean Pickup Team`,
      htmlFile: 'createAccount.html'
    });

    res.status(201).json(userObj);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const existingUser = await user.findOne({ "emailPrimary": req.body.id });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(req.body.pwd, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const userObj = existingUser.toObject();
    delete userObj.password;
    delete userObj.__v;
    res.status(200).json( userObj );
  } catch (err) {
    res.status(500).json({ error: 'Failed to login', details: err.message });
  }
};

exports.patchUsers = async (req, res) => {
  try {
    const updatedUser = await user.findByIdAndUpdate(req.query.id, req.body, { new: true }); // Return the updated document
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user', details: err.message });
  }
};
