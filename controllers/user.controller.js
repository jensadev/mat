const User = require('../models/user.model');

module.exports.index = async (req, res) => {
  let users = await User.find();
  return res.send(users);
};

module.exports.show = async (req, res) => {
  let userId = parseInt(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).send('Invalid object id');
  }
  
  let user = await User.find(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }
  return res.send(user);
};