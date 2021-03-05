const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
  const token = req.body.headers.authorization;
  if (!token) {
    res.status(403).json({error: "please provide a token"});
  } else {
    // eslint-disable-next-line no-undef
    jwt.verify(token.split(" ")[1], process.env.SECRET, (err, value) => {
      if (err) res.status(500).json( { error: 'failed to authenticate token' } );
      req.user = value.data;
      console.table(req.user);
      next();
    });
  }
}