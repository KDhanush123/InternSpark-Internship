const User = require('./authModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await User.create({ email, password });
    res.status(201).json({ message: 'Signup successful. Please login.' });

  };

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', secure: false });
  res.json({ message: 'Login successful' });
};

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.json({ message: 'Logged out' });
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};