const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const { BadRequestError } = require('../errors');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new BadRequestError('Email already exists');
  }

  const user = await User.create({ name, email, password });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: { name: user.name, email: user.email, location: user.location },
    token,
  });
};

const login = async (req, res) => {
  throw new BadRequestError('BR');
  res.send('login');
};

const logout = async (req, res) => {
  res.send('logout');
};

module.exports = {
  register,
  login,
  logout,
};
