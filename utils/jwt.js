const jwt = require('jsonwebtoken');

module.exports.sign = async (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: user.id,
        handle: user.handle,
        email: user.email
      },
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      }
    );
  });
};

module.exports.decode = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
};

//TESTING
/* const test = async () => {
    const data = {
        username: 'Varun',
        email:' varun'
    }
    const token = await sign(data)
    console.log("token is:",token);
    const decoded = await decode(token)
    console.log("DEcoded:",decoded);
}

test() */
