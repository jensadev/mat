const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
  const token = req.headers.authorization;

  // console.table(token)
  // console.table(req.body)

  if (!token) {
    res.status(401).json({ error: 'please provide a token' });
  } else {
    // eslint-disable-next-line no-undef
    jwt.verify(token.split(' ')[1], process.env.SECRET, (err, value) => {
      if (err) res.status(401).json({ error: 'failed to authenticate token' });
      req.user = value.data;
      // console.table(value);
      next();
    });
  }
};
