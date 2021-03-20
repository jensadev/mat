const { databaseVersion } = require('../dbConnection');
const User = require('../models/User');

const adjektiv = require('../docs/adjektiv.json');
const substantiv = require('../docs/substantiv.json');

module.exports.store = async (req, res) => {
  try {
    if (!req.user.sub) throw new Error('Sub is Required');
    if (!req.user.email) throw new Error('Email is Required');

    const existingUser = await User.findByPk(req.user.sub);
    if (existingUser) throw new Error('User aldready exists with this sub id');

    const user = await User.create({
      sub: splitSub(req.user.sub),
      nickname: generateUserName(),
      email: req.user.email
    });

    if (user) {
      res.status(201).json({ user });
    }
  } catch (e) {
    res
      .status(422)
      .json({ errors: { body: ['Could not create user ', e.message] } });
  }
};

module.exports.show = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) {
      throw new Error('No such user found');
    }
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(404).json({
      errors: { body: [e.message] }
    });
  }
};

function splitSub(sub) {
  return String(sub).split('|')[1];
}

function generateUserName() {
  let adj = this.getRandomInt(0, adjektiv.length);
  let sub = this.getRandomInt(0, substantiv.length);
  return (
    this.capitalizeFirstLetter(adjektiv[adj]) +
    this.capitalizeFirstLetter(substantiv[sub]) +
    this.clamp(adj + sub, 0, 5000)
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
