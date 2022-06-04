const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const { BadRequestError, UnAuthenticatedError } = require('../errors');

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
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid credentials');
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const { name, email, location } = req.body;
  console.log(name, email, location);
  if (!name || !email || !location) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email, location },
    { new: true, runValidators: true }
  );

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      token,
    },
  });
};

module.exports = {
  register,
  login,
  updateUser,
};
